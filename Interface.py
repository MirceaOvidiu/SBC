import xml.etree.ElementTree as ET

tree = ET.parse("Database.xml")
root = tree.getroot()

def extrage_fapte_reguli():
    fapte = []
    reguli = []

    for fapt in root.findall(".//fapt"):
        element = list(fapt)[0]
        fapte.append({
            "type": element.tag,
            "attributes": element.attrib,
            "value": element.text.strip() if element.text else None,
        })

    for regula in root.findall(".//regula"):
        conditii = [conditie.text.strip() for conditie in regula.findall("conditie")]
        concluzie = regula.find("concluzie").text.strip()
        calcul = [conditie.text.strip() for conditie in regula.findall("calcul")]
        rule = {
            "conditions": conditii,
            "conclusion": concluzie,
        }
        if calcul:
            rule["calculus"] = calcul

        reguli.append(rule)

    return fapte, reguli

def verify_simple_conditions(condition, facts, value, **args):
    if isinstance(value, list):
        extracted_capacity = None
        for item in value:
            if isinstance(item, dict) and "capacitate" in item:
                extracted_capacity = item["capacitate"]
                value.remove(item)  # Remove the item from the list
                break

        # Verificam daca valoarea transmisa este din faptul comanda ori vehicul
        if any("comanda" in item for item in value):
            matches_order = False
            for val in value:
                fact = [f for f in facts if f["value"] == val]

                if fact:
                    fact_dict = fact[0]
                    
                    departure = fact_dict["attributes"].get("nod1") or ""
                    destination = fact_dict["attributes"].get("nod2") or ""
                    id = fact_dict["attributes"].get("id") or ""
                    mass = fact_dict["attributes"].get("greutate") or ""
                    # greutate proritate

                    mapping = {
                        "id" : id,
                        "Plecare" : departure,
                        "Destinatie" : destination,
                        "greutate" : mass,
                        "capacitate" : extracted_capacity
                    }

                    if "\=" in condition:
                        var1, var2 = condition.split("\=")
                        var1, var2 = var1.strip(), var2.strip()
                        if mapping[var1] != mapping[var2]:
                            # De adaugat printari cu informatie aici
                            return True
                        
                    if ">=" in condition:
                        var1, var2 = condition.split(">=")
                        var1, var2 = var1.strip(), var2.strip()
                        try:
                            if int(mapping[var1.lower()]) >= int(mapping[var2.lower()]):
                                matches_order = True
                                print("Vehiculul poate suporta:", fact_dict["value"])
                        except (TypeError, ValueError, KeyError) as e:
                            print(f"Skipping due to error: {e}")
                            return False
            return matches_order

        else:
            for mapping in value:
                mapping["greutate"] = args.get("greutate")


                if ">=" in condition:
                    var1, var2 = condition.split(">=")
                    var1, var2 = var1.strip(), var2.strip()
                    try:
                        if int(mapping[var1.lower()]) >= int(mapping[var2.lower()]):
                            # Find the vehicle name from facts
                            vehicle_name = mapping.get('autoturism', 'necunoscut')
                            vehicle_capacity = mapping.get('capacitate', 'N/A')
                            print(f"Vehicul compatibil: {vehicle_name} (capacitate: {vehicle_capacity} kg)")
                    except (TypeError, ValueError, KeyError) as e:
                        print(f"Skipping due to error: {e}")
                        return False
                    
            return True
    else:

        fact = [f for f in facts if f["value"] == value]
        # Verificăm dacă am găsit cel puțin o fapta
        if fact:
            # Accesăm primul element din lista
            fact_dict = fact[0]

            locationA = fact_dict["attributes"].get("locatieA") or ""
            locationB = fact_dict["attributes"].get("locatieB") or ""
            distance = fact_dict["attributes"].get("distanta") or 0
            time = fact_dict["attributes"].get("timp") or 0 

            mapping = {
                "A" : locationA,
                "B" : locationB,
                "C" : args.get("C"),
                "Distanta": distance,
                "Timp": time
            }

            #print(f"Distanta: {distance}, Timp: {time}")
            if ">" in condition:
                var, val = condition.split(">")
                var, val = var.strip(), int(val.strip())
                if var in mapping and int(mapping[var]) > val:
                    print("Total timp:", time)
                    return True
                else:
                    print(f"Condiția eșuată: {var} > {val}")
                    return False
                
            if "\=" in condition:
                var1, var2 = condition.split("\=")
                var1, var2 = var1.strip(), var2.strip()
                if mapping[var1] != mapping[var2]:
                    return True
                else:
                    print(f"Condiția eșuată: {var1} != {var2}")
                    return False

        else:
            print("Nu s-a găsit fapta cu valoarea:", value)

def verify_facts(condition, facts, value, **args):
    
    if "drum(" in condition:
        print("Conditie cu drum:", condition)
        # Extragem toate faptele de tip `drum`
        roads = [f for f in facts if f["type"] == "drum"]
        for road in roads:
            locationA = road["attributes"].get("locatieA")
            locationB = road["attributes"].get("locatieB")

            #print(f"Analizăm fapt: locatieA={locationA}, locatieB={locationB}, distanta={distance}, timp={time}")
            if (args.get('A') == locationA and args.get('B') == locationB) or (args.get('A') == locationB and args.get('B') == locationA):
                return True, road["value"]
        
        return False, "nimic"

    elif "vehicul(" in condition and args.get("greutate") != 0:
        print("Conditie cu vehicul:", condition)

        if args.get('Vehicul'):
            vehicles = [f for f in facts if f["type"] == "vehicul"]
            selected_vehicle = next((v for v in vehicles if v["attributes"]["autoturism"] == args.get('Vehicul')), None)

            if selected_vehicle:
                vehicle_capacity = selected_vehicle["attributes"]["capacitate"]
                new_capacity = {
                    "capacitate" : vehicle_capacity
                }
                
                try:
                    if not isinstance(value, list):
                        value = []
                    value.append(new_capacity)
                except AttributeError as e:
                    print(f"Error encountered: {e}")
                    print("Skipping append due to incorrect type for 'value'.")
                    value = [new_capacity] 
                
                return True, value
            else:
                print("Nu s-au gasit asemenea vehicule")

            return False, "nimic"
        else:
            # Extragem toate faptele de tip `vehicul`
            vehicles = [f for f in facts if f["type"] == "vehicul"]
            # Extragem doar atributele din fiecare fapt
            attributes_list = [vehicle["attributes"] for vehicle in vehicles]
            return True, attributes_list

    elif "comanda(" in condition:
        print("Conditie cu comanda:", condition)
        value = []

        orders = [f for f in facts if f["type"] == "comanda"]
        for order in orders:
            departure = order["attributes"].get("nod1") 
            destination = order["attributes"].get("nod2")
            priority = order["attributes"].get("prioritate")
            
            if args.get('Plecare') == departure and args.get('Destinatie') == destination:
                if priority == "1":
                    return True, value
            
            if args.get('Plecare') == departure or args.get("id") is not None:
                value.append(order["value"])

        if not value:
            return False, "nimic"
        else:
            return True, value        
                
    elif "depozit(" in condition:
        print("Conditie cu depozit:", condition)
        # Extragem toate faptele de tip `depozit`
        deposits = [f for f in facts if f["type"] == "depozit"]
        for deposit in deposits:
            location = deposit["attributes"].get("nume")

            if( args.get('A') == location or args.get('B') == location ):
                return True, deposit["value"]
            
        return False, "nimic"
    
    else:
        print("Conditie simpla cu operator:")
        return verify_simple_conditions(condition, facts, value, **args), value

def calculate_rule(facts, rule, value, **args):

    roads = [f for f in facts if f["value"] == value]
    for road in roads:
        variables = {
            "Distanta": road["attributes"].get("distanta"),
            "ConsumPerKm": args.get('Consum')
        }

        for formula in rule["calculus"]:
            for var, value in variables.items():
                formula = formula.replace(var, str(value))
        try:
            result = eval(formula)  
            print(f"Rezultat calculat: {result}")
            return True
        except Exception as e:
            print(f"Error in efectuarea calculului: {e}")
            return False


# A si B reprezinta niste parametrii in cazul vehiculeleor B este greutatea
def evaluate_rules(facts, rules, **args):
    matched_conclusions = []
    i = 1

    for rule in rules:
        
        all_conditions_met = True
        value = ""
        
        print(f"{i} Regula",rule)
        i = i + 1
        for cond in rule["conditions"]:

            # Verificăm condițiile complexe cu `;`
            if ";" in cond:
                sub_conditions = [sub.strip() for sub in cond.split(";")]
                for sub_condition in sub_conditions:
                    condition_met, value = verify_facts(sub_condition, facts, value, **args)
                      
            else:
                condition_met, value = verify_facts(cond, facts, value, **args)  

            if condition_met == False:
                all_conditions_met = False
                break
        
        if "calculus" in rule:
            all_conditions_met = calculate_rule(facts, rule, value, **args)

        if all_conditions_met == True:         
             print(f"Concluzie aplicabilă: {rule['conclusion']} \n\n")
        else:
            print("Nu există concluzii aplicabile. \n\n")
    

fapte, reguli = extrage_fapte_reguli()
