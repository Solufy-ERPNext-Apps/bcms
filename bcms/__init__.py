__version__ = "0.0.1"
import frappe

def check_app_permission():
	"""Check if user has permission to access the app (for showing the app on app screen)"""
	if frappe.session.user == "Administrator":
		return True

	if frappe.has_permission("Land Purchase", ptype="read"):
		return True

	return False

def check_app_permissions():
	return False