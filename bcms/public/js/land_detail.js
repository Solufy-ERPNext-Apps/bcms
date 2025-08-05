
frappe.listview_settings['Land Details'] = frappe.listview_settings['Land Details'] || {};
frappe.listview_settings['Land Details'].button = [
    {
        name: 'go_to_project',
        show: () => true,
        get_label: () => __('Create Project'),
        get_description: () => __('Go to Project'),
        action: function (doc) {
            frappe.new_doc('Project', {
                custom_land: doc.name
            });
        }
    }
];
