// Tab switching
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
        content.classList.remove('active');
    }

    const tabs = document.getElementsByClassName('tab');
    for (let tab of tabs) {
        tab.classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');

    // Load content when switching to data tabs
    if (tabName === 'roads') loadRoads();
    if (tabName === 'vehicles') loadVehicles();
    if (tabName === 'orders') loadOrders();
    if (tabName === 'facts') loadFacts();
    if (tabName === 'rules') loadRules();
    if (tabName === 'bestroute') loadLocationsForRoute();
}

// Update query form based on selected type
function updateQueryForm() {
    const queryType = document.getElementById('queryType').value;
    const formContainer = document.getElementById('queryForm');
    
    let formHTML = '<div class="grid">';
    
    switch(queryType) {
        case 'direct_connection':
            formHTML += `
                <div class="form-group">
                    <label>Locația A:</label>
                    <input type="text" id="paramA" placeholder="ex: bucuresti">
                </div>
                <div class="form-group">
                    <label>Locația B:</label>
                    <input type="text" id="paramB" placeholder="ex: craiova">
                </div>
            `;
            break;
        case 'connection_via':
            formHTML += `
                <div class="form-group">
                    <label>Locația A:</label>
                    <input type="text" id="paramA" placeholder="ex: bucuresti">
                </div>
                <div class="form-group">
                    <label>Locația B:</label>
                    <input type="text" id="paramB" placeholder="ex: craiova">
                </div>
                <div class="form-group">
                    <label>Prin Locația C:</label>
                    <input type="text" id="paramC" placeholder="ex: ploiesti">
                </div>
            `;
            break;
        case 'check_depot':
            formHTML += `
                <div class="form-group">
                    <label>Locație:</label>
                    <input type="text" id="paramA" placeholder="ex: bucuresti">
                </div>
            `;
            break;
        case 'vehicles_by_weight':
            formHTML += `
                <div class="form-group">
                    <label>Greutate (kg):</label>
                    <input type="number" id="paramGreutate" placeholder="ex: 4000">
                </div>
            `;
            break;
        case 'orders_from':
            formHTML += `
                <div class="form-group">
                    <label>Locație de Plecare:</label>
                    <input type="text" id="paramPlecare" placeholder="ex: bucuresti">
                </div>
            `;
            break;
        case 'priority_orders':
            formHTML += `
                <div class="form-group">
                    <label>Plecare:</label>
                    <input type="text" id="paramPlecare" placeholder="ex: bucuresti">
                </div>
                <div class="form-group">
                    <label>Destinație:</label>
                    <input type="text" id="paramDestinatie" placeholder="ex: pitesti">
                </div>
            `;
            break;
        case 'fuel_consumption':
            formHTML += `
                <div class="form-group">
                    <label>Locația A:</label>
                    <input type="text" id="paramA" placeholder="ex: bucuresti">
                </div>
                <div class="form-group">
                    <label>Locația B:</label>
                    <input type="text" id="paramB" placeholder="ex: craiova">
                </div>
                <div class="form-group">
                    <label>Consum (L/100km):</label>
                    <input type="number" step="0.1" id="paramConsum" placeholder="ex: 8.5">
                </div>
            `;
            break;
        case 'vehicle_order':
            formHTML += `
                <div class="form-group">
                    <label>Nume Vehicul:</label>
                    <input type="text" id="paramVehicul" placeholder="ex: tir1">
                </div>
                <div class="form-group">
                    <label>ID Comandă:</label>
                    <input type="text" id="paramId" placeholder="ex: 1">
                </div>
            `;
            break;
        case 'best_route':
            formHTML += `
                <div class="form-group">
                    <label>Punct de Plecare:</label>
                    <input type="text" id="paramStart" placeholder="ex: bucuresti">
                </div>
                <div class="form-group">
                    <label>Destinație:</label>
                    <input type="text" id="paramEnd" placeholder="ex: constanta">
                </div>
                <div class="form-group">
                    <label>Criteriu de Optimizare:</label>
                    <select id="paramCriteria">
                        <option value="shortest">📏 Ruta cea mai scurtă (distanță minimă)</option>
                        <option value="fastest">⚡ Ruta cea mai rapidă (timp minim)</option>
                    </select>
                </div>
            `;
            break;
        case 'route_via_intermediate':
            formHTML += `
                <div class="form-group">
                    <label>Locația A (Plecare):</label>
                    <input type="text" id="paramA" placeholder="ex: bucuresti">
                </div>
                <div class="form-group">
                    <label>Locația C (Intermediar):</label>
                    <input type="text" id="paramC" placeholder="ex: ploiesti">
                </div>
                <div class="form-group">
                    <label>Locația B (Destinație):</label>
                    <input type="text" id="paramB" placeholder="ex: constanta">
                </div>
            `;
            break;
        case 'transport_cost':
            formHTML += `
                <div class="form-group">
                    <label>Vehicul:</label>
                    <input type="text" id="paramVehicle" placeholder="ex: tir1">
                </div>
                <div class="form-group">
                    <label>Locația A (Plecare):</label>
                    <input type="text" id="paramStart" placeholder="ex: bucuresti">
                </div>
                <div class="form-group">
                    <label>Locația B (Destinație):</label>
                    <input type="text" id="paramEnd" placeholder="ex: craiova">
                </div>
                <div class="form-group">
                    <label>Preț Combustibil (RON/litru):</label>
                    <input type="number" step="0.01" id="paramFuelPrice" placeholder="ex: 7.5">
                </div>
            `;
            break;
        case 'all_routes':
            formHTML += `
                <div class="form-group">
                    <label>Punct de Plecare:</label>
                    <input type="text" id="paramStart" placeholder="ex: bucuresti">
                </div>
                <div class="form-group">
                    <label>Destinație:</label>
                    <input type="text" id="paramEnd" placeholder="ex: constanta">
                </div>
            `;
            break;
    }
    
    formHTML += '</div>';
    formContainer.innerHTML = formHTML;
}

// Execute query
async function executeQuery() {
    const queryType = document.getElementById('queryType').value;
    const loading = document.getElementById('loading');
    const output = document.getElementById('queryOutput');
    
    // Special handling for best_route query type
    if (queryType === 'best_route') {
        const start = document.getElementById('paramStart')?.value;
        const end = document.getElementById('paramEnd')?.value;
        const criteria = document.getElementById('paramCriteria')?.value;
        
        if (!start || !end) {
            alert('Vă rugăm să completați punctul de plecare și destinația!');
            return;
        }
        
        loading.classList.add('active');
        output.style.display = 'none';
        
        try {
            const response = await fetch('/api/best_route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    start: start,
                    end: end,
                    criteria: criteria || 'shortest'
                })
            });
            
            const data = await response.json();
            
            loading.classList.remove('active');
            output.style.display = 'block';
            
            if (data.error) {
                output.className = 'output-box error';
                output.textContent = 'Eroare: ' + data.error;
            } else {
                output.className = 'output-box success';
                output.innerHTML = formatQueryResult(data, 'best_route');
            }
        } catch (error) {
            loading.classList.remove('active');
            output.style.display = 'block';
            output.className = 'output-box error';
            output.textContent = 'Eroare: ' + error.message;
        }
        return;
    }
    
    // Handle all_routes with special endpoint
    if (queryType === 'all_routes') {
        const start = document.getElementById('paramStart')?.value;
        const end = document.getElementById('paramEnd')?.value;
        
        if (!start || !end) {
            output.style.display = 'block';
            output.className = 'output-box error';
            output.textContent = 'Te rog completează toate câmpurile!';
            return;
        }
        
        loading.classList.add('active');
        output.style.display = 'none';
        
        try {
            const response = await fetch('/api/all_routes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    start: start,
                    end: end
                })
            });
            
            const data = await response.json();
            
            loading.classList.remove('active');
            output.style.display = 'block';
            
            if (data.success) {
                output.className = 'output-box success';
                output.innerHTML = formatAllRoutesResult(data);
            } else {
                output.className = 'output-box error';
                output.textContent = data.message || 'Nu s-au găsit rute';
            }
        } catch (error) {
            loading.classList.remove('active');
            output.style.display = 'block';
            output.className = 'output-box error';
            output.textContent = 'Eroare: ' + error.message;
        }
        return;
    }
    
    // Handle transport_cost with special endpoint
    if (queryType === 'transport_cost') {
        const vehicle = document.getElementById('paramVehicle')?.value;
        const start = document.getElementById('paramStart')?.value;
        const end = document.getElementById('paramEnd')?.value;
        const fuelPrice = document.getElementById('paramFuelPrice')?.value;
        
        if (!vehicle || !start || !end || !fuelPrice) {
            output.style.display = 'block';
            output.className = 'output-box error';
            output.textContent = 'Te rog completează toate câmpurile!';
            return;
        }
        
        loading.classList.add('active');
        output.style.display = 'none';
        
        try {
            const response = await fetch('/api/transport_cost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vehicle: vehicle,
                    start: start,
                    end: end,
                    fuel_price: parseFloat(fuelPrice)
                })
            });
            
            const data = await response.json();
            
            loading.classList.remove('active');
            output.style.display = 'block';
            
            if (data.success) {
                output.className = 'output-box success';
                output.innerHTML = formatTransportCostResult(data);
            } else {
                output.className = 'output-box error';
                output.textContent = data.error || 'Nu s-a putut calcula costul';
            }
        } catch (error) {
            loading.classList.remove('active');
            output.style.display = 'block';
            output.className = 'output-box error';
            output.textContent = 'Eroare: ' + error.message;
        }
        return;
    }
    
    // Gather parameters
    const params = {};
    const inputs = document.querySelectorAll('#queryForm input, #queryForm select');
    inputs.forEach(input => {
        const paramName = input.id.replace('param', '');
        if (input.value) {
            params[paramName] = input.value;
        }
    });
    
    loading.classList.add('active');
    output.style.display = 'none';
    
    try {
        const response = await fetch('/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query_type: queryType,
                params: params
            })
        });
        
        const data = await response.json();
        
        loading.classList.remove('active');
        output.style.display = 'block';
        
        if (data.success) {
            output.className = 'output-box success';
            output.innerHTML = formatQueryResult(data.result, queryType);
        } else {
            output.className = 'output-box error';
            output.textContent = 'Eroare: ' + data.error;
        }
    } catch (error) {
        loading.classList.remove('active');
        output.style.display = 'block';
        output.className = 'output-box error';
        output.textContent = 'Eroare: ' + error.message;
    }
}

// Format query result for display
function formatQueryResult(result, queryType) {
    if (!result) return 'Niciun rezultat';
    
    let html = `<div style="font-size: 16px;"><strong>${result.message}</strong></div><br>`;
    
    switch(queryType) {
        case 'direct_connection':
            if (result.has_connection) {
                html += `<div style="color: #28a745; font-size: 18px; font-weight: bold;">✓ DA</div>`;
                if (result.distance_km) {
                    html += `<div style="margin-top: 10px;">📏 Distanță: <strong>${result.distance_km} km</strong></div>`;
                }
                if (result.time_min) {
                    html += `<div>⏱️ Timp: <strong>${result.time_min} minute</strong></div>`;
                }
            } else {
                html += `<div style="color: #dc3545; font-size: 18px; font-weight: bold;">✗ NU</div>`;
            }
            break;
            
        case 'connection_via':
            if (result.has_connection) {
                html += `<div style="color: #28a745; font-size: 18px; font-weight: bold;">✓ DA</div>`;
            } else {
                html += `<div style="color: #dc3545; font-size: 18px; font-weight: bold;">✗ NU</div>`;
            }
            break;
            
        case 'check_depot':
            if (result.is_depot) {
                html += `<div style="color: #28a745; font-size: 18px; font-weight: bold;">✓ DA - Este depozit</div>`;
            } else {
                html += `<div style="color: #dc3545; font-size: 18px; font-weight: bold;">✗ NU - Nu este depozit</div>`;
            }
            break;
            
        case 'vehicles_by_weight':
            html += `<div style="font-size: 18px; font-weight: bold; color: #667eea;">📊 ${result.count} vehicul(e)</div>`;
            if (result.vehicle_details && result.vehicle_details.length > 0) {
                html += '<div style="margin-top: 15px;"><table class="data-table" style="font-size: 14px;"><thead><tr><th>ID</th><th>Nume Vehicul</th><th>Capacitate (kg)</th><th>Consum (L/100km)</th></tr></thead><tbody>';
                result.vehicle_details.forEach(v => {
                    html += `
                        <tr>
                            <td>${v.id}</td>
                            <td>🚛 ${v.name}</td>
                            <td>${v.capacity}</td>
                            <td>${v.consumption}</td>
                        </tr>
                    `;
                });
                html += '</tbody></table></div>';
            }
            break;
            
        case 'orders_from':
            html += `<div style="font-size: 18px; font-weight: bold; color: #667eea;">📦 ${result.count} comandă/comenzi</div>`;
            if (result.orders && result.orders.length > 0) {
                html += '<ul style="margin-top: 10px;">';
                result.orders.forEach(o => {
                    html += `<li>${o}</li>`;
                });
                html += '</ul>';
            }
            break;
            
        case 'priority_orders':
            if (result.has_priority_order) {
                html += `<div style="color: #28a745; font-size: 18px; font-weight: bold;">✓ DA - Există comenzi cu prioritate 1</div>`;
            } else {
                html += `<div style="color: #dc3545; font-size: 18px; font-weight: bold;">✗ NU - Fără comenzi cu prioritate 1</div>`;
            }
            break;
            
        case 'fuel_consumption':
            if (result.fuel_liters !== null && result.fuel_liters !== undefined) {
                html += `<div style="font-size: 24px; font-weight: bold; color: #667eea;">⛽ ${result.fuel_liters} litri</div>`;
            } else {
                html += `<div style="color: #dc3545;">Nu s-a putut calcula consumul</div>`;
            }
            break;
            
        case 'vehicle_order':
            if (result.can_handle) {
                html += `<div style="color: #28a745; font-size: 18px; font-weight: bold;">✓ DA - Vehiculul poate transporta comanda</div>`;
            } else {
                html += `<div style="color: #dc3545; font-size: 18px; font-weight: bold;">✗ NU - Vehiculul nu poate transporta comanda</div>`;
            }
            break;
            
        case 'best_route':
            // Format best route result
            if (result.path && result.distance !== undefined && result.time !== undefined) {
                html = `<div style="font-size: 16px;"><strong>✓ Rută optimă găsită!</strong></div><br>`;
                
                // Display path
                html += '<div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 15px;">';
                html += '<strong>📍 Traseul:</strong><br>';
                html += '<div style="font-size: 18px; font-weight: bold; color: #667eea; margin-top: 10px;">';
                html += result.path.map((loc, idx) => {
                    if (idx === 0) return `🚀 ${loc}`;
                    if (idx === result.path.length - 1) return `🎯 ${loc}`;
                    return `📍 ${loc}`;
                }).join(' → ');
                html += '</div></div>';
                
                // Display metrics
                html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">';
                html += `
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border: 2px solid #2196f3;">
                        <div style="color: #1976d2; font-weight: bold;">📏 Distanță Totală</div>
                        <div style="font-size: 32px; font-weight: bold; color: #1976d2; text-align: center; margin-top: 10px;">
                            ${result.distance} <span style="font-size: 18px;">km</span>
                        </div>
                    </div>
                    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border: 2px solid #ff9800;">
                        <div style="color: #f57c00; font-weight: bold;">⏱️ Timp Estimat</div>
                        <div style="font-size: 32px; font-weight: bold; color: #f57c00; text-align: center; margin-top: 10px;">
                            ${result.time} <span style="font-size: 18px;">min</span>
                        </div>
                    </div>
                `;
                html += '</div>';
            } else {
                html += `<div style="color: #dc3545; font-size: 18px; font-weight: bold;">✗ Nu s-a găsit nicio rută</div>`;
            }
            break;
        
        case 'route_via_intermediate':
            if (result.has_route && result.total_distance) {
                html += `<div style="font-size: 18px; font-weight: bold; color: #28a745;">✓ Rută disponibilă!</div><br>`;
                html += `<div style="font-size: 20px; color: #667eea;">📏 Distanță totală: ${result.total_distance} km</div>`;
            } else {
                html += `<div style="color: #dc3545;">Nu s-a putut calcula ruta cu intermediar</div>`;
            }
            break;
    }
    
    // Add debug output in small text
    if (result.raw_output) {
        html += `<details style="margin-top: 20px; font-size: 12px; color: #666;">
            <summary style="cursor: pointer;">Detalii tehnice (click pentru a extinde)</summary>
            <pre style="margin-top: 10px; white-space: pre-wrap;">${result.raw_output}</pre>
        </details>`;
    }
    
    return html;
}

// Load roads
async function loadRoads() {
    const container = document.getElementById('roadsContent');
    container.innerHTML = '<div class="loading active"><div class="spinner"></div></div>';
    
    try {
        const response = await fetch('/api/facts');
        const data = await response.json();
        
        if (data.success) {
            const roads = data.facts.filter(f => f.type === 'drum');
            
            let html = '<table class="data-table"><thead><tr><th>ID</th><th>Locația A</th><th>Locația B</th><th>Distanță (km)</th><th>Timp (min)</th></tr></thead><tbody>';
            
            roads.forEach(road => {
                html += `
                    <tr>
                        <td>${road.value}</td>
                        <td>${road.attributes.locatieA}</td>
                        <td>${road.attributes.locatieB}</td>
                        <td>${road.attributes.distanta}</td>
                        <td>${road.attributes.timp}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p class="error">Eroare la încărcarea drumurilor</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="error">Eroare: ' + error.message + '</p>';
    }
}

// Load vehicles
async function loadVehicles() {
    const container = document.getElementById('vehiclesContent');
    container.innerHTML = '<div class="loading active"><div class="spinner"></div></div>';
    
    try {
        const response = await fetch('/api/facts');
        const data = await response.json();
        
        if (data.success) {
            const vehicles = data.facts.filter(f => f.type === 'vehicul');
            
            let html = '<table class="data-table"><thead><tr><th>ID</th><th>Nume Vehicul</th><th>Capacitate (kg)</th><th>Consum (L/100km)</th></tr></thead><tbody>';
            
            vehicles.forEach(vehicle => {
                html += `
                    <tr>
                        <td>${vehicle.value}</td>
                        <td>${vehicle.attributes.autoturism}</td>
                        <td>${vehicle.attributes.capacitate}</td>
                        <td>${vehicle.attributes.consum}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p class="error">Eroare la încărcarea vehiculelor</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="error">Eroare: ' + error.message + '</p>';
    }
}

// Load orders
async function loadOrders() {
    const container = document.getElementById('ordersContent');
    container.innerHTML = '<div class="loading active"><div class="spinner"></div></div>';
    
    try {
        const response = await fetch('/api/facts');
        const data = await response.json();
        
        if (data.success) {
            const orders = data.facts.filter(f => f.type === 'comanda');
            
            let html = '<table class="data-table"><thead><tr><th>ID Comandă</th><th>De la</th><th>Către</th><th>Greutate (kg)</th><th>Prioritate</th></tr></thead><tbody>';
            
            orders.forEach(order => {
                const priority = order.attributes.prioritate;
                html += `
                    <tr>
                        <td>${order.attributes.id}</td>
                        <td>${order.attributes.nod1}</td>
                        <td>${order.attributes.nod2}</td>
                        <td>${order.attributes.greutate}</td>
                        <td><span class="badge badge-priority-${priority}">Prioritate ${priority}</span></td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p class="error">Eroare la încărcarea comenzilor</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="error">Eroare: ' + error.message + '</p>';
    }
}

// Load facts
async function loadFacts() {
    const container = document.getElementById('factsContent');
    container.innerHTML = '<div class="loading active"><div class="spinner"></div></div>';
    
    try {
        const response = await fetch('/api/facts');
        const data = await response.json();
        
        if (data.success) {
            let html = '<table class="data-table"><thead><tr><th>Tip</th><th>ID</th><th>Atribute</th></tr></thead><tbody>';
            
            data.facts.forEach(fact => {
                const attrs = JSON.stringify(fact.attributes, null, 2);
                html += `
                    <tr>
                        <td>${fact.type}</td>
                        <td>${fact.value}</td>
                        <td><pre style="margin: 0; font-size: 12px;">${attrs}</pre></td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p class="error">Eroare la încărcarea faptelor</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="error">Eroare: ' + error.message + '</p>';
    }
}

// Load rules
async function loadRules() {
    const container = document.getElementById('rulesContent');
    container.innerHTML = '<div class="loading active"><div class="spinner"></div></div>';
    
    try {
        const response = await fetch('/api/rules');
        const data = await response.json();
        
        if (data.success) {
            let html = '';
            
            data.rules.forEach((rule, index) => {
                html += `
                    <div class="info-section" style="margin-bottom: 20px;">
                        <h3>Regula ${index + 1}</h3>
                        <p><strong>Condiții:</strong></p>
                        <ul>
                            ${rule.conditions.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                        <p><strong>Concluzie:</strong> ${rule.conclusion}</p>
                        ${rule.calculus ? `<p><strong>Calcul:</strong> ${rule.calculus.join(', ')}</p>` : ''}
                    </div>
                `;
            });
            
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p class="error">Eroare la încărcarea regulilor</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="error">Eroare: ' + error.message + '</p>';
    }
}

// Load locations for route finder
async function loadLocationsForRoute() {
    try {
        const response = await fetch('/api/locations');
        const data = await response.json();
        
        if (data.success) {
            const startSelect = document.getElementById('routeStart');
            const endSelect = document.getElementById('routeEnd');
            
            // Clear existing options except the first one
            startSelect.innerHTML = '<option value="">Selectați locația...</option>';
            endSelect.innerHTML = '<option value="">Selectați locația...</option>';
            
            // Add locations
            data.locations.forEach(loc => {
                startSelect.innerHTML += `<option value="${loc}">${loc}</option>`;
                endSelect.innerHTML += `<option value="${loc}">${loc}</option>`;
            });
        }
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

// Find best route
async function findBestRoute() {
    const start = document.getElementById('routeStart').value;
    const end = document.getElementById('routeEnd').value;
    const criteria = document.getElementById('routeCriteria').value;
    const loading = document.getElementById('routeLoading');
    const output = document.getElementById('routeOutput');
    
    if (!start || !end) {
        alert('Vă rugăm să selectați atât punctul de plecare cât și destinația!');
        return;
    }
    
    if (start === end) {
        alert('Punctul de plecare și destinația trebuie să fie diferite!');
        return;
    }
    
    loading.classList.add('active');
    output.style.display = 'none';
    
    try {
        const response = await fetch('/api/best_route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start: start,
                end: end,
                criteria: criteria
            })
        });
        
        const data = await response.json();
        
        loading.classList.remove('active');
        output.style.display = 'block';
        
        if (data.error) {
            output.innerHTML = `
                <div class="output-box error">
                    <strong>❌ ${data.error}</strong>
                </div>
            `;
        } else {
            const criteriaText = criteria === 'shortest' ? 'cea mai scurtă' : 'cea mai rapidă';
            const optimizedFor = criteria === 'shortest' ? 'distanță' : 'timp';
            
            let html = `
                <div class="info-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <h3 style="color: white; margin-bottom: 15px;">✓ Ruta ${criteriaText} găsită!</h3>
                    <div style="font-size: 18px;">
                        <p><strong>De la:</strong> ${start}</p>
                        <p><strong>Către:</strong> ${end}</p>
                    </div>
                </div>
                
                <div class="info-section">
                    <h3>📍 Traseul</h3>
                    <div style="font-size: 18px; font-weight: bold; color: #667eea; margin: 15px 0;">
            `;
            
            // Display path with arrows
            html += data.path.map((loc, idx) => {
                if (idx === 0) return `🚀 ${loc}`;
                if (idx === data.path.length - 1) return `🎯 ${loc}`;
                return `📍 ${loc}`;
            }).join(' → ');
            
            html += `
                    </div>
                </div>
                
                <div class="grid">
                    <div class="info-section" style="background: #e3f2fd; border: 2px solid #2196f3;">
                        <h3 style="color: #1976d2;">📏 Distanță Totală</h3>
                        <div style="font-size: 36px; font-weight: bold; color: #1976d2; text-align: center;">
                            ${data.distance} <span style="font-size: 24px;">km</span>
                        </div>
                    </div>
                    
                    <div class="info-section" style="background: #fff3e0; border: 2px solid #ff9800;">
                        <h3 style="color: #f57c00;">⏱️ Timp Estimat</h3>
                        <div style="font-size: 36px; font-weight: bold; color: #f57c00; text-align: center;">
                            ${data.time} <span style="font-size: 24px;">min</span>
                        </div>
                    </div>
                </div>
                
                <div class="info-section" style="background: #f1f8e9; border: 2px solid #8bc34a;">
                    <h3 style="color: #558b2f;">✨ Optimizat pentru ${optimizedFor}</h3>
                    <p style="font-size: 16px;">
                        Această rută a fost selectată deoarece ${criteria === 'shortest' ? 'are cea mai mică distanță' : 'necesită cel mai puțin timp'} dintre toate rutele posibile.
                    </p>
                </div>
            `;
            
            output.innerHTML = html;
        }
    } catch (error) {
        loading.classList.remove('active');
        output.style.display = 'block';
        output.innerHTML = `
            <div class="output-box error">
                <strong>Eroare:</strong> ${error.message}
            </div>
        `;
    }
}

// Format all routes result
function formatAllRoutesResult(data) {
    let html = `<div style="font-size: 18px; font-weight: bold; color: #28a745; margin-bottom: 15px;">`;
    html += `✓ ${data.count} rută/rute găsite!</div>`;
    
    data.routes.forEach((route, index) => {
        html += '<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #667eea;">';
        html += `<div style="font-weight: bold; color: #667eea; margin-bottom: 8px;">🛣️ Ruta ${index + 1}</div>`;
        
        // Path
        html += '<div style="margin-bottom: 8px;"><strong>Traseu:</strong><br>';
        html += '<div style="font-size: 16px; margin-top: 5px;">';
        html += route.path.map((loc, idx) => {
            if (idx === 0) return `🚀 ${loc}`;
            if (idx === route.path.length - 1) return `🎯 ${loc}`;
            return `➜ ${loc}`;
        }).join(' ');
        html += '</div></div>';
        
        // Stats
        html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">';
        html += `<div><strong>📏 Distanță:</strong> ${route.distance} km</div>`;
        html += `<div><strong>⏱️ Timp:</strong> ${route.time} min</div>`;
        html += '</div>';
        
        html += '</div>';
    });
    
    return html;
}

// Format transport cost result
function formatTransportCostResult(data) {
    let html = '<div style="font-size: 18px; font-weight: bold; color: #28a745; margin-bottom: 15px;">';
    html += '✓ Calcul cost transport finalizat!</div>';
    
    html += '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">';
    
    // Route info
    html += `<div style="font-size: 16px; margin-bottom: 15px;"><strong>🚛 Vehicul:</strong> ${data.vehicle}</div>`;
    html += `<div style="font-size: 16px; margin-bottom: 15px;"><strong>🗺️ Rută:</strong> ${data.route}</div>`;
    html += `<div style="font-size: 16px; margin-bottom: 15px;"><strong>📏 Distanță:</strong> ${data.distance_km} km</div>`;
    
    html += '<hr style="margin: 15px 0; border: none; border-top: 1px solid #dee2e6;">';
    
    // Fuel consumption
    html += '<div style="margin-bottom: 15px;">';
    html += `<div><strong>⛽ Consum:</strong> ${data.consumption_per_100km} L/100km</div>`;
    html += `<div><strong>📊 Total combustibil:</strong> ${data.fuel_liters} litri</div>`;
    html += `<div><strong>💵 Preț combustibil:</strong> ${data.fuel_price_per_liter} RON/L</div>`;
    html += '</div>';
    
    html += '<hr style="margin: 15px 0; border: none; border-top: 1px solid #dee2e6;">';
    
    // Total cost - highlighted
    html += '<div style="background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 15px;">';
    html += `<div style="font-size: 14px; margin-bottom: 5px;">💰 COST TOTAL TRANSPORT</div>`;
    html += `<div style="font-size: 28px; font-weight: bold;">${data.total_cost} RON</div>`;
    html += `<div style="font-size: 12px; margin-top: 5px; opacity: 0.9;">(${data.cost_per_km} RON/km)</div>`;
    html += '</div>';
    
    html += '</div>';
    
    return html;
}

// Initialize form on page load
updateQueryForm();
