from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import Interface as inference_engine
import io
import sys
import re

app = Flask(__name__)
CORS(app)

# Load facts and rules once at startup
fapte, reguli = inference_engine.extrage_fapte_reguli()

def parse_query_output(output, query_type):
    """Parse the raw output and extract relevant data based on query type"""
    
    if not output or not output.strip():
        return {
            'has_result': False,
            'message': 'Nu s-au găsit rezultate pentru această interogare'
        }
    
    result = {'raw_output': output}
    
    if query_type == 'direct_connection':
        # Check if connection exists
        if 'conexiune_directa' in output.lower() or 'concluzie aplicabilă' in output.lower():
            result['has_connection'] = True
            result['message'] = 'Conexiune directă disponibilă'
            # Extract distance and time if present
            distance_match = re.search(r'distanta[:\s]+(\d+)', output, re.IGNORECASE)
            time_match = re.search(r'timp[:\s]+(\d+)', output, re.IGNORECASE)
            if distance_match:
                result['distance_km'] = int(distance_match.group(1))
            if time_match:
                result['time_min'] = int(time_match.group(1))
        else:
            result['has_connection'] = False
            result['message'] = 'Nu există conexiune directă între aceste locații'
    
    elif query_type == 'connection_via':
        # Check for connection through intermediate point
        if 'concluzie aplicabilă' in output.lower():
            result['has_connection'] = True
            result['message'] = 'Conexiune disponibilă prin punctul intermediar'
        else:
            result['has_connection'] = False
            result['message'] = 'Nu există conexiune prin punctul specificat'
    
    elif query_type == 'check_depot':
        # Check if location is a depot
        if 'depozit' in output.lower() and 'concluzie aplicabilă' in output.lower():
            result['is_depot'] = True
            result['message'] = 'Locația este un depozit valid'
        else:
            result['is_depot'] = False
            result['message'] = 'Locația nu este un depozit'
    
    elif query_type == 'vehicles_by_weight':
        # Extract vehicles that can carry the weight
        vehicles = []
        vehicle_data = []
        
        # Look for vehicle names and capacities in output
        for line in output.split('\n'):
            # Match new format: "Vehicul compatibil: name (capacitate: X kg)"
            vehicle_match = re.search(r'Vehicul compatibil:\s*(\w+)\s*\(capacitate:\s*(\d+)\s*kg\)', line, re.IGNORECASE)
            if vehicle_match:
                vehicle_name = vehicle_match.group(1)
                capacity = vehicle_match.group(2)
                if vehicle_name not in [v['name'] for v in vehicle_data]:
                    vehicle_data.append({
                        'name': vehicle_name,
                        'capacity': capacity
                    })
            
            # Also match vehicle IDs
            vehicle_id_match = re.search(r'(vehicul_\d+)', line, re.IGNORECASE)
            if vehicle_id_match and vehicle_id_match.group(1) not in vehicles:
                vehicles.append(vehicle_id_match.group(1))
        
        # Get vehicle details from facts
        from Interface import extrage_fapte_reguli
        facts, _ = extrage_fapte_reguli()
        all_vehicles = [f for f in facts if f['type'] == 'vehicul']
        
        # Match vehicles by name or ID
        matched_vehicles = []
        if vehicle_data:
            for v_data in vehicle_data:
                for vehicle in all_vehicles:
                    if vehicle['attributes'].get('autoturism') == v_data['name']:
                        matched_vehicles.append({
                            'id': vehicle['value'],
                            'name': vehicle['attributes'].get('autoturism'),
                            'capacity': vehicle['attributes'].get('capacitate'),
                            'consumption': vehicle['attributes'].get('consum')
                        })
                        break
        
        if matched_vehicles:
            result['vehicles'] = [v['id'] for v in matched_vehicles]
            result['count'] = len(matched_vehicles)
            result['vehicle_details'] = matched_vehicles
            result['message'] = f'{len(matched_vehicles)} vehicul(e) pot transporta această greutate'
        else:
            result['vehicles'] = []
            result['count'] = 0
            result['vehicle_details'] = []
            result['message'] = 'Niciun vehicul nu poate transporta această greutate'
    
    elif query_type == 'orders_from':
        # Extract orders from location
        orders = []
        for line in output.split('\n'):
            order_match = re.search(r'comanda_(\d+)', line, re.IGNORECASE)
            if order_match:
                orders.append(f'comanda_{order_match.group(1)}')
        
        if orders:
            result['orders'] = list(set(orders))
            result['count'] = len(orders)
            result['message'] = f'{len(orders)} comandă/comenzi găsite'
        else:
            result['orders'] = []
            result['count'] = 0
            result['message'] = 'Nu există comenzi din această locație'
    
    elif query_type == 'priority_orders':
        # Check for priority orders
        if 'concluzie aplicabilă' in output.lower():
            result['has_priority_order'] = True
            result['message'] = 'Există comenzi cu prioritate 1 pentru această rută'
        else:
            result['has_priority_order'] = False
            result['message'] = 'Nu există comenzi cu prioritate 1 pentru această rută'
    
    elif query_type == 'fuel_consumption':
        # Extract fuel consumption calculation
        consumption_match = re.search(r'rezultat calculat[:\s]+(\d+\.?\d*)', output, re.IGNORECASE)
        if consumption_match:
            result['fuel_liters'] = float(consumption_match.group(1))
            result['message'] = f'Consum total: {result["fuel_liters"]} litri'
        else:
            result['fuel_liters'] = None
            result['message'] = 'Nu s-a putut calcula consumul de combustibil'
    
    elif query_type == 'vehicle_order':
        # Check if vehicle can handle the order
        if 'poate suporta' in output.lower() or 'concluzie aplicabilă' in output.lower():
            result['can_handle'] = True
            result['message'] = 'Vehiculul poate transporta această comandă'
        else:
            result['can_handle'] = False
            result['message'] = 'Vehiculul nu poate transporta această comandă'
    
    return result

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/query', methods=['POST'])
def query():
    """Execute a query against the knowledge base"""
    old_stdout = sys.stdout
    try:
        data = request.json
        query_type = data.get('query_type')
        params = data.get('params', {})
        
        # Capture print output
        sys.stdout = buffer = io.StringIO()
        
        # Execute query based on type and map parameters correctly
        query_params = {}
        
        # Map frontend parameter names to backend expected names
        if 'A' in params:
            query_params['A'] = params['A']
        if 'B' in params:
            query_params['B'] = params['B']
        if 'C' in params:
            query_params['C'] = params['C']
        if 'Greutate' in params or 'greutate' in params:
            query_params['greutate'] = int(params.get('Greutate', params.get('greutate', 0)))
        if 'Plecare' in params:
            query_params['Plecare'] = params['Plecare']
        if 'Destinatie' in params:
            query_params['Destinatie'] = params['Destinatie']
        if 'Consum' in params:
            query_params['Consum'] = int(params['Consum'])
        if 'Vehicul' in params:
            query_params['Vehicul'] = params['Vehicul']
        if 'Id' in params or 'id' in params:
            query_params['id'] = params.get('Id', params.get('id'))
        
        # Execute query
        inference_engine.evaluate_rules(fapte, reguli, **query_params)
        
        # Get output
        output = buffer.getvalue()
        sys.stdout = old_stdout
        
        # Parse output to extract relevant data
        parsed_result = parse_query_output(output, query_type)
        
        return jsonify({
            'success': True,
            'result': parsed_result,
            'query_type': query_type,
            'params': params
        })
    
    except Exception as e:
        sys.stdout = old_stdout
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/facts', methods=['GET'])
def get_facts():
    """Return all facts from knowledge base"""
    try:
        return jsonify({
            'success': True,
            'facts': fapte
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/rules', methods=['GET'])
def get_rules():
    """Return all rules from knowledge base"""
    try:
        return jsonify({
            'success': True,
            'rules': reguli
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/locations', methods=['GET'])
def get_locations():
    """Get all unique locations from roads and depots"""
    try:
        locations = set()
        
        # From roads
        for fact in fapte:
            if fact['type'] == 'drum':
                locations.add(fact['attributes'].get('locatieA'))
                locations.add(fact['attributes'].get('locatieB'))
        
        # From depots
        for fact in fapte:
            if fact['type'] == 'depozit':
                locations.add(fact['attributes'].get('nume'))
        
        return jsonify({
            'success': True,
            'locations': sorted(list(locations))
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    """Get all vehicles"""
    try:
        vehicles = [f for f in fapte if f['type'] == 'vehicul']
        return jsonify({
            'success': True,
            'vehicles': vehicles
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders"""
    try:
        orders = [f for f in fapte if f['type'] == 'comanda']
        return jsonify({
            'success': True,
            'orders': orders
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
