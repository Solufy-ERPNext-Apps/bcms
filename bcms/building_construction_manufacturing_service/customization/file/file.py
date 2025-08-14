import frappe

def before_insert(doc,method=None):
    if doc.attached_to_doctype == "Project":
        label = frappe.db.get_value("DocField", {"fieldname": doc.attached_to_field}, "label")
        last_value = 0
        if file_data := frappe.db.get_all("File", {"attached_to_doctype": "Project", "attached_to_name": doc.attached_to_name, "attached_to_field": doc.attached_to_field, "file_name": ["LIKE", f"{label}%%"]}, "file_name"):
            for row in file_data:
                file_name = row.file_name.split(".")
                if file_name:
                    try:
                        int_value = int(file_name[-2][-1]) + 1
                    except:
                        int_value = 1
                    last_value = max(int_value, last_value)
                    
        if last_value > 0:
            doc.file_name = f"{label} - [{frappe.utils.formatdate(frappe.utils.today())}] - {last_value}.{doc.file_type.lower()}"
        else:
            doc.file_name = f"{label} - [{frappe.utils.formatdate(frappe.utils.today())}].{doc.file_type.lower()}"
        doc.save_file_on_filesystem()
    file_size=10
    file_size_mb = doc.file_size / (1024 * 1024)
    if file_size_mb > file_size:
        frappe.throw(f"File size exceeds the limit of {file_size} MB. Your file is {round(file_size_mb, 2)} MB.")