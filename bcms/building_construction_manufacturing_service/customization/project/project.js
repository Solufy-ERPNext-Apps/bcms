
frappe.ui.form.on("Project", {
	custom_branch: function(frm) {
		if (frm.doc.custom_branch && frm.doc.project_type) {
			frm.set_value("project_name", frm.doc.project_type + " at " + frm.doc.custom_branch);
		}
	},
	project_type: function(frm) {
		if (frm.doc.custom_branch && frm.doc.project_type) {
			frm.set_value("project_name", frm.doc.project_type + " at " + frm.doc.custom_branch);
		}
	},
	refresh: function(frm) {
		cur_frm.remove_custom_button('Set Project Status','Actions')
		cur_frm.remove_custom_button('Duplicate Project with Tasks', 'Actions');
		cur_frm.remove_custom_button('Update Total Purchase Cost', 'Actions'); 
		cur_frm.remove_custom_button('Set Project Status', 'Actions');
		cur_frm.remove_custom_button('Gantt Chart', 'View');
		cur_frm.remove_custom_button('Kanban Board', 'View');
	}
});

frappe.ui.form.on("Estimate", {
	quantity: function(frm, cdt, cdn) {
		const row = locals[cdt][cdn];
		if (row.quantity && row.rate) {
			row.amount = flt(row.quantity) * flt(row.rate);
			frm.refresh_field("estimate_items");
		}
		frm.doc.custom_total_amount = frm.doc.custom_bill_of_quantity.reduce((sum, item) => {
			return sum + (flt(item.quantity) * flt(item.rate));
		}, 0);
		frm.refresh_field("custom_total_amount");
	},
	rate: function(frm, cdt, cdn) {
		const row = locals[cdt][cdn];
		if (row.quantity && row.rate) {
			row.amount = flt(row.quantity) * flt(row.rate);
			frm.refresh_field("estimate_items");
		}
		frm.doc.custom_total_amount = frm.doc.custom_bill_of_quantity.reduce((sum, item) => {
			return sum + (flt(item.quantity) * flt(item.rate));
		}, 0);
		frm.refresh_field("custom_total_amount");
	},
	
	
})
frappe.ui.form.on("Financial Approval", {
	estimated_cost: function(frm, cdt, cdn) {
		frm.doc.custom_total_estimated_cost = frm.doc.custom_financiallll_approval.reduce((sum, item) => {
			return sum + (flt(item.estimated_cost));
		}, 0);
		frm.refresh_field("custom_total_estimated_cost");
	},
})
frappe.ui.form.on('Custom Disbursement Detail', {
    custom_disbursement_detail_add: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
		const today = frappe.datetime.get_today();
		row.posted_on = today;
        refresh_field("custom_disbursement_detail");
    }
})


frappe.ui.form.on('Project', {
	onload(frm) {
		frm.no_timeline = true; 
	},
	refresh(frm) {
		if (frm.timeline && frm.timeline.wrapper) {
			frm.timeline.wrapper.hide();
		}
		if (frm.fields_dict.__connections__) {
			frm.fields_dict.__connections__.wrapper.hide();
		}
	}
});
frappe.ui.form.on('Project', {
	refresh: function(frm) {
		frappe.after_ajax(() => {
			setTimeout(() => {
				if (frm.page.sidebar) {
					const sidebar = frm.page.sidebar;
					
					sidebar.find('.sidebar-menu a:contains("See on Website")').hide();
					sidebar.find('.form-stats-likes').hide();
					sidebar.find('.comment-icon').hide();
					sidebar.find('.ml-2').hide();
					sidebar.find('.modified-by').hide();
					sidebar.find('.mx-2').hide();
					sidebar.find('.created-by').hide();
					sidebar.find('.comments').hide();
					sidebar.find('.form-tags').hide();
					sidebar.find('.form-shared').hide();
					sidebar.find('.icon-sm').hide();
					sidebar.find('.form-follow').hide();
					frm.page.wrapper.find(".comment-box").css({'display':'none'});
					$(".form-assignments").hide()
					frm.page.wrapper.find('.scroll-to-top btn btn-default icon-btn').css({'display':'none'})
					frm.page.wrapper.find('.actions-btn-group:visible').first().css({'display':'none'});
				}   

			}, 0); 
		});
	}
});
frappe.ui.form.on('Project', {
	branch: function(frm) {
		if (frm.doc.branch) {
			frappe.db.get_doc('Branch', frm.doc.branch).then(function(doc) {
				frm.set_value('custom_branch', doc.branch);
				frm.set_value('custom_state', doc.state);
				frm.set_value('custom_zone_no', doc.zone);
				frm.set_value('custom_district', doc.district);
				frm.set_value('custom_branch_code', doc.branch_code);
			});
		}
	}
});

frappe.ui.form.on('Project', {
	refresh: function (frm) {
		if (!frm.is_new() && frm.doc.workflow_state !== "Work completion Certificate") {
			const apr_btn = frm.add_custom_button(__('Approve'), function () {
				frappe.call({
					method: "bcms.building_construction_manufacturing_service.customization.project.project.workflow_state",
					args: {
						docname: frm.doc.name,
						workflow_state: frm.doc.workflow_state
					},
					callback: function (r) {
						if (r.message) {
							frappe.msgprint(__("Project Approved"));
							frm.reload_doc();
							frappe.set_route("List", "Project");
						}
					}
				});
			});
			apr_btn.css({
				'background-color': 'Green',
				'color': 'White',
				'font-weight': 'bold'
			});
		}
		if (!frm.is_new() && frm.doc.workflow_state !== "Project Request" && frm.doc.workflow_state !== "Work completion Certificate") {
			const rj_btn = frm.add_custom_button(__('Reject'), function () {
				frappe.call({
				    method: "bcms.building_construction_manufacturing_service.customization.project.project.reject_project",
				    args: {
				        docname: frm.doc.name,
						workflow_state: frm.doc.workflow_state
				    },
				    callback: function (r) {
				        if (r.message) {
							console.log(r)
							frappe.msgprint(__("Project Rejected"));
							frm.reload_doc();
				            frappe.set_route("List", "Project");
				        }
				    }
				});
			});
			rj_btn.css({
				'background-color': 'Red',
				'color': 'White',
				'font-weight': 'bold'
			});
		}
		if (!frm.is_new() && frm.doc.workflow_state !== "Work completion Certificate") {
			const r_review_btn = frm.add_custom_button(__('Request For Review'), function () {
				const dialog = new frappe.ui.Dialog({
					title: __('Request For Review'),
					fields: [
						{
							fieldname: 'adhikari',
							fieldtype: 'Link',
							options: "Employee",
							label: __('Adhikari'),
							reqd: 1,
						},
						{
							fieldname: 'remarks',
							fieldtype: 'Small Text',
							label: __('Remarks'),
							reqd: 1,
						}
					],
				});
				dialog.show();
			})

			r_review_btn.css({
				'background-color': 'DarkBlue',
				'color': 'White',
				'font-weight': 'bold'
			});
		if (!frm.is_new() && frm.doc.workflow_state !== "Project Request" && frm.doc.workflow_state !== "Work completion Certificate") {
			const dis_btn = frm.add_custom_button(__('Additional Fund Request'), function () {
				frappe.new_doc("Additional Fund Request", {
					project:frm.doc.name,
					project_name: frm.doc.project_name,
					project_type:frm.doc.project_type,
					branch:frm.doc.custom_branch,
					status:frm.doc.status
				});
			});
			dis_btn.css({
				'background-color': 'Black',
				'color': 'White',
				'font-weight': 'bold'
			});
		}

			

frappe.ui.form.on('Project', {

	onload_post_render: function(frm) {
		frm.set_df_property('custom_disbursement_detail', 'cannot_delete_rows', true);
		frm.refresh_field('custom_disbursement_detail');

		frm.set_df_property('custom_additional_request_details', 'cannot_delete_rows', true);
		frm.refresh_field('custom_additional_request_details');
	},

	onload(frm) {
		frm.set_df_property('custom_disbursement_detail', 'cannot_delete_rows', true);
		frm.set_df_property('custom_additional_request_details', 'cannot_delete_rows', true);
		frm.refresh_field('custom_disbursement_detail');
        frm.refresh_field('custom_additional_request_details');
		setup_disbursement_events(frm);
		setup_additional_request_events(frm);
		
	},


	refresh(frm) {

		setup_disbursement_events(frm);
		setup_additional_request_events(frm);

		calculate_total_allocate_amount(frm);
		update_disbursement_status_from_last_row(frm);
		update_addtional_request_status_from_last_row(frm)
		frm.set_df_property('custom_disbursement_detail', 'cannot_delete_rows', true);
		frm.set_df_property('custom_additional_request_details', 'cannot_delete_rows', true);
		frm.refresh_field('custom_disbursement_detail');
        frm.refresh_field('custom_additional_request_details');
	
	},

	validate(frm) {

	
	let disbursement_errors = [];
	(frm.doc.custom_disbursement_detail || []).forEach(row => {
		const approved = flt(row.approved_amount);
		const requested = flt(row.requested_amount);
		if (approved > requested) {
			disbursement_errors.push(`Disbursement Row ${row.idx}: Approved (${approved}) > Requested (${requested})`);
		}
	});

	let additional_errors = [];
	(frm.doc.custom_additional_request_details || []).forEach(row => {
		const approved = flt(row.approved_amount);
		const requested = flt(row.requested_amount);
		if (approved > requested) {
			additional_errors.push(`Additional Request Row ${row.idx}: Approved (${approved}) > Requested (${requested})`);
		}
	});

	const all_errors = [...disbursement_errors, ...additional_errors];
	if (all_errors.length > 0) {
		frappe.throw(all_errors.join("<br>"));
	};


	calculate_additional_required_amount(frm);
	calculate_total_allocate_amount(frm);
	calculate_disbursement_and_remaining(frm, true);
	update_disbursement_status_from_last_row(frm);
	update_addtional_request_status_from_last_row(frm)
	},

	custom_project_allocated_amount(frm) {
		calculate_total_allocate_amount(frm);
	},

	custom_additional_require_amount(frm) {
		calculate_additional_required_amount(frm);
		calculate_total_allocate_amount(frm);
		calculate_disbursement_and_remaining(frm, false);
	},

	custom_suggested_by_member_incharge_a__f(frm) {
		update_project_allocated_from_suggestion(frm);
	}
});







function setup_disbursement_events(frm) {
	if (!frm.custom_disbursement_events_setup) {
		setTimeout(() => {
			const field = frm.fields_dict.custom_disbursement_detail;
			if (field && field.grid && typeof field.grid.on === 'function') {
				field.grid.on('child_change', () => {
					calculate_disbursement_and_remaining(frm, false);
					update_disbursement_status_from_last_row(frm);
					update_addtional_request_status_from_last_row(frm);
					frm.dirty();
				});
				frm.custom_disbursement_events_setup = true;
			}
		}, 300); 
	}
}

function setup_additional_request_events(frm) {
	if (!frm.custom_additional_events_setup) {
		setTimeout(() => {
			const field = frm.fields_dict.custom_additional_request_details;
			if (field && field.grid && typeof field.grid.on === 'function') {
				field.grid.on('child_change', () => {
					calculate_additional_required_amount(frm);
					calculate_disbursement_and_remaining(frm, false);
					frm.dirty();
				});
				frm.custom_additional_events_setup = true;
			}
		}, 300); 
	}
}

function calculate_additional_required_amount(frm) {
	let total = 0;
	let updated = false;
	(frm.doc.custom_additional_request_details || []).forEach(row => {
		if (row.current_state === "Approved") {
			const today = frappe.datetime.get_today();
			if (!row.approved_on || row.approved_on !== today) {
				row.approved_on = today;
				updated = true;
			}
			total += flt(row.approved_amount);
		}
	});

	if (frm.doc.custom_additional_require_amount !== total) {
		frm.set_value("custom_additional_require_amount", total).then(() => frm.dirty());
	}

	if (updated) {
		frm.refresh_field("custom_additional_request_details");
		frm.dirty();
	}
}

function calculate_total_allocate_amount(frm) {
	const base = flt(frm.doc.custom_project_allocated_amount);
	const additional = flt(frm.doc.custom_additional_require_amount);
	const total = base + additional;

	if (frm.doc.custom_total_allocated_amount !== total) {
		frm.set_value("custom_total_allocated_amount", total).then(() => frm.dirty());
	}

	calculate_disbursement_and_remaining(frm, false);
}

function calculate_disbursement_and_remaining(frm, validate_rows) {
	const total_allocated = flt(frm.doc.custom_total_allocated_amount);
	let total_approved = 0;

	for (const row of (frm.doc.custom_disbursement_detail || [])) {
		if (row.current_state !== "Disbursed") continue;
		const today = frappe.datetime.get_today();
		if (!row.approved_on || row.approved_on !== today) {
			row.approved_on = today;
			updated = true;
		}
		const approved = flt(row.approved_amount);
		const requested = flt(row.requested_amount);

		if (validate_rows && approved > requested) {
			frappe.throw(`Row ${row.idx}: Approved Amount (${approved}) cannot be greater than Requested Amount (${requested}).`);
		} else if (!validate_rows && approved > requested) {
			frappe.msgprint(`Row ${row.idx}: Approved > Requested. Resetting approved_amount to 0.`);
			row.approved_amount = 0;
		}

		total_approved += row.approved_amount;
	}

	if (frm.doc.custom_disbursement_amount !== total_approved) {
		frm.set_value("custom_disbursement_amount", total_approved).then(() => frm.dirty());
	}

	if (total_approved > total_allocated) {
		const msg = "Total Disbursement exceeds Total Allocated Amount.";
		if (validate_rows) {
			frappe.throw(msg);
		} else {
			frappe.msgprint(msg);
		}calculate_disbursement_and_remaining
	}

	const remaining = total_allocated - total_approved;

	
	if (frm.doc.custom_remaining_amount !== remaining) {
		frm.set_value("custom_remaining_amount", remaining).then(() => frm.dirty());
	}
	if (
		remaining === 0 &&
		frm.doc.workflow_state === "Under Disbursement" &&
		frm.doc.__islocal !== 1 
	) {
		frm.set_value("workflow_state", "Work completion Certificate").then(() => {
			frm.dirty();
		});
	}
}

function update_disbursement_status_from_last_row(frm) {
	const disbursements = frm.doc.custom_disbursement_detail || [];

	if (disbursements.length > 0) {
		const last_row = disbursements[disbursements.length - 1];
		const status = last_row.current_state || "";

		if (frm.doc.custom_disbursement_status !== status) {
			frm.set_value("custom_disbursement_status", status).then(() => frm.dirty());
		}
	} else {
		if (frm.doc.custom_disbursement_status) {
			frm.set_value("custom_disbursement_status", "").then(() => frm.dirty());
		}
	}
}

function update_addtional_request_status_from_last_row(frm) {
	const disbursements = frm.doc.custom_additional_request_details || [];

	if (disbursements.length > 0) {
		const last_row = disbursements[disbursements.length - 1];
		const status = last_row.current_state || "";

		if (frm.doc.custom_additional_request_status !== status) {
			frm.set_value("custom_additional_request_status", status).then(() => frm.dirty());
		}
	} else {
		if (frm.doc.custom_additional_request_status) {
			frm.set_value("custom_additional_request_status", "").then(() => frm.dirty());
		}
	}
}

function update_project_allocated_from_suggestion(frm) {
	const value = flt(frm.doc.custom_suggested_by_member_incharge_a__f);
	if (frm.doc.custom_project_allocated_amount !== value) {
		frm.set_value("custom_project_allocated_amount", value).then(() => frm.dirty());
	}
}
		}
	}
});


frappe.ui.form.on('Project', {
    onload_post_render: function(frm) {
        set_all_in_words(frm);
    },
    refresh: function(frm) {
        set_all_in_words(frm);
    },

    custom_estimate_cost: function(frm) {
        get_in_words(frm, 'custom_estimate_cost', 'custom_estimate_cost_in_the_words');
    },
    custom_total_estimated_cost: function(frm) {
        get_in_words(frm, 'custom_total_estimated_cost', 'custom_total_estimated_cost_in_site');
    },
    custom_total_amount: function(frm) {
        get_in_words(frm, 'custom_total_amount', 'custom_total_amount_in_words');
    },
    custom_suggested_by_member_incharge_pp: function(frm) {
        get_in_words(frm, 'custom_suggested_by_member_incharge_pp', 'custom_amount_in_words_in_pp');
    },
    custom_suggested_by_secretory_snm: function(frm) {
        get_in_words(frm, 'custom_suggested_by_secretory_snm', 'custom_amount_in_words_snm');
    },
    custom_suggested_by_member_incharge_a__f: function(frm) {
        get_in_words(frm, 'custom_suggested_by_member_incharge_a__f', 'custom_amount_in_words_a__f');
    },
    custom_project_allocated_amount: function(frm) {
        get_in_words(frm, 'custom_project_allocated_amount', 'custom_project_allocated_amount_in_words');
    },
    custom_total_allocated_amount: function(frm) {
        get_in_words(frm, 'custom_total_allocated_amount', 'custom_total_allocated_amount_in_words');
    },
    custom_disbursement_amount: function(frm) {
        get_in_words(frm, 'custom_disbursement_amount', 'custom_disbursement_amount_in_words');
    },
    custom_remaining_amount: function(frm) {
        get_in_words(frm, 'custom_remaining_amount', 'custom_remaining_amount_in_words');
    },
    custom_additional_require_amount: function(frm) {
        get_in_words(frm, 'custom_additional_require_amount', 'custom_additional_require_amount_in_words');
    }
});

function get_in_words(frm, source_field, target_field) {
    const value = frm.doc[source_field];
    if (value) {
        frappe.call({
            method: "bcms.building_construction_manufacturing_service.customization.project.project.get_amount_in_words",
            args: { amount: value },
            callback: function(r) {
                if (r.message) {
                    frm.set_value(target_field, r.message);

                }
            }
        });
    } else {
        frm.set_value(target_field, "");
    }
}

// ✅ Helper function to call on form load
function set_all_in_words(frm) {
    const field_map = {
        'custom_estimate_cost': 'custom_estimate_cost_in_the_words',
        'custom_total_estimated_cost': 'custom_total_estimated_cost_in_site',
        'custom_total_amount': 'custom_total_amount_in_words',
        'custom_suggested_by_member_incharge_pp': 'custom_amount_in_words_in_pp',
        'custom_suggested_by_secretory_snm': 'custom_amount_in_words_snm',
        'custom_suggested_by_member_incharge_a__f': 'custom_amount_in_words_a__f',
        'custom_project_allocated_amount': 'custom_project_allocated_amount_in_words',
        'custom_total_allocated_amount': 'custom_total_allocated_amount_in_words',
        'custom_disbursement_amount': 'custom_disbursement_amount_in_words',
        'custom_remaining_amount': 'custom_remaining_amount_in_words',
        'custom_additional_require_amount': 'custom_additional_require_amount_in_words'
    };

    for (let source in field_map) {
        let target = field_map[source];
        get_in_words(frm, source, target);
    }
}



frappe.ui.form.on('Project', {
    onload: function (frm) {
        if (!frm.is_new()) return;

        const urlParams = new URLSearchParams(window.location.search);
        const fields = [
            "land", "custom_bhavan", "custom_branch", "custom_branch_code", "custom_estimate_cost",
            "project_name", "custom_zone", "custom_zone_no", "custom_zone_name",
            "custom_zonal_incharge", "custom_mobile_no"
        ];

        fields.forEach(field => {
            const value = urlParams.get(field);
            if (value) frm.set_value(field, value);
        });
    },

    refresh: function (frm) {
        if (!frm.is_new()) return;

        const fields_to_display = [
            "land", "custom_bhavan", "custom_branch", "custom_branch_code", "custom_estimate_cost",
            "project_name", "custom_zone", "custom_zone_no", "custom_zone_name",
            "custom_zonal_incharge", "custom_mobile_no"
        ];

        let html = `<h4><b>Land Details Summary</b></h4><table class="table table-bordered"><tr><th>Field</th><th>Value</th></tr>`;

        fields_to_display.forEach(field => {
            html += `<tr><td>${frappe.model.unscrub(field)}</td><td>${frm.doc[field] || ''}</td></tr>`;
        });

        html += `</table>`;

        frm.fields_dict.land_summary.$wrapper.html(html);
    }
});


frappe.ui.form.on('Project', {
    onload: function (frm) {
        if (!frm.is_new()) return;

        const urlParams = new URLSearchParams(window.location.search);
        const land_id = urlParams.get("land_id");

        if (land_id) {
            // Set land_id to custom_land field
            frm.set_value("custom_land", land_id);

            // Fetch land details from server
            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "Land Details",
                    name: land_id
                },
                callback: function (r) {
                    if (r.message) {
                        const land = r.message;

                        // Save data to display in HTML summary
                        frm.land_details_data = {
                            "Land ID": land.name,
                            "Branch": land.custom_branch,
                            "State": land.state,
                            "Zone": land.custom_zone,
                            "Zone No": land.custom_zone_no,
                            "Zone Name": land.custom_zone_name,
                            "Bhavan": land.custom_bhavan,
                            "Branch Code": land.custom_branch_code,
                            "Estimate Cost": land.custom_estimate_cost,
                            "Project Name": land.project_name,
                            "Zonal Incharge": land.custom_zonal_incharge,
                            "Mobile No": land.custom_mobile_no
                        };

                        // Optional: also set some fields if you want
                        frm.set_value("project_name", land.project_name || "");
                        frm.set_value("custom_branch", land.custom_branch || "");

                        render_land_summary(frm);
                    }
                }
            });
        }
    },

    refresh: function (frm) {
        if (frm.is_new() && frm.land_details_data) {
            render_land_summary(frm);
        }
    }
});

function render_land_summary(frm) {
    const data = frm.land_details_data || {};
    if (!Object.keys(data).length) return;

    let html = `
        <h4><b>Land Details Summary</b></h4>
        <table class="table table-bordered" style="margin-top: 10px;">
            <thead>
                <tr><th>Field</th><th>Value</th></tr>
            </thead>
            <tbody>
    `;

    Object.entries(data).forEach(([key, value]) => {
        html += `<tr><td>${key}</td><td>${value || ''}</td></tr>`;
    });

    html += `</tbody></table>`;
    frm.fields_dict.custom_land_summarys.$wrapper.html(html);  // 👈 Renders in HTML field
}

frappe.ui.form.on('Project', {
    onload: function (frm) {
        if (!frm.is_new()) return;

        const urlParams = new URLSearchParams(window.location.search);
        const land_id = urlParams.get("land_id");

        if (land_id) {
            frm.set_value("custom_land", land_id);
        }
    }
});