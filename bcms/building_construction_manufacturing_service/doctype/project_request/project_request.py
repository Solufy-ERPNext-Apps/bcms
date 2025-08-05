import frappe
from frappe.model.document import Document
from frappe.utils import get_link_to_form, format_date, money_in_words

class ProjectRequest(Document):
    pass
@frappe.whitelist()
def get_amount_in_words(amount):
    try:
        return money_in_words(amount)
    except Exception as e:
        frappe.throw(f"Error converting to words: {e}")
        