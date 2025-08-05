import frappe

def create_warehouse_on_bhavan_insert(doc, method=None):
    if not frappe.db.exists("Warehouse", doc.name):
        warehouse = frappe.new_doc("Warehouse")
        warehouse.warehouse_name = doc.name
        warehouse.company = frappe.defaults.get_user_default("company")
        warehouse.insert(ignore_permissions=True)
        frappe.msgprint(f"Warehouse '{doc.name}' created successfully.")
