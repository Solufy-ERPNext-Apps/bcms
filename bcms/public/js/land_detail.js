
// frappe.listview_settings['Land Details'] = frappe.listview_settings['Land Details'] || {};

// frappe.listview_settings['Land Details'].button = [
// 	{
// 		name: 'btn-action',
// 		show: (doc) => true,
// 		get_label: () => __('Action'),
// 		get_description: () => __('Perform actions'),

// 		action: function (doc, $button) {

// 			$('.custom-dropdown-menu').remove();

// 			const offset = $button.offset();
// 			const height = $button.outerHeight();

// 			const dropdown = $(`
// 				<div class="custom-dropdown-menu dropdown-menu show" style="position:absolute; z-index: 9999; min-width: 150px;">
// 					<a class="dropdown-item" href="#" data-action="Project">Project</a>
// 				</div>
// 			`);

// 			$('body').append(dropdown);

// 			dropdown.css({
// 				top: offset.top + height,
// 				left: offset.left
// 			});

// 			dropdown.find('a.dropdown-item').on('click', function (e) {
// 				e.preventDefault();
// 				const action_type = $(this).data('action');
// 				dropdown.remove();
// 			});

// 			$(document).on('click.customDropdown', function (e) {
// 				if (!dropdown.is(e.target) && dropdown.has(e.target).length === 0 && !$button.is(e.target)) {
// 					dropdown.remove();
// 					$(document).off('click.customDropdown');
// 				}
// 			});
// 		}
// 	}
// ];



frappe.listview_settings['Land Details'] = frappe.listview_settings['Land Details'] || {};

frappe.listview_settings['Land Details'].button = [
    {
        name: 'go_to_project',
        show: () => true,
        get_label: () => __('Action'),
        get_description: () => __('Go to Project'),
        action: function (doc) {
            const url = `/app/project/new-project-1?land_id=${doc.name}`;
            window.location.href = url;
        }
    }
];
