
import frappe

def enqueue_user_permission(doc, method = None):
	sync_user_workflow_permissions(doc)
	# frappe.enqueue("bcms.building_construction_manufacturing_service.customization.project.user.sync_user_workflow_permissions",
	#     queue='default',
	#     timeout=300,
	#     now=False,
	#     user=doc.name
	# )	

def sync_user_workflow_permissions(user):

	old_permissions = frappe.get_all("User Permission", 
		filters={
			"user": user.name,
			"allow": "Workflow State"
		},
		pluck="name"
	)
	if old_permissions:
		frappe.delete_doc("User Permission", old_permissions, ignore_permissions=True)
	workflow = frappe.get_doc("Workflow", {"document_type": "Project"})
	roles = [row.role for row in user.roles]
	print(roles)
	for transition in workflow.transitions:
		if transition.allowed in roles:
			if not frappe.db.exists("User Permission", {
				"user": user.name,
				"allow": "Workflow State",
				"for_value": transition.state
			}):
				user_perm = frappe.new_doc("User Permission")
				user_perm.user = user
				user_perm.allow = "Workflow State"
				user_perm.for_value = transition.state
				user_perm.insert(ignore_permissions=True)
