frappe.ui.form.on("Project", {
  custom_branch: function (frm) {
    if (frm.doc.custom_branch && frm.doc.project_type) {
      frm.set_value(
        "project_name",
        frm.doc.project_type + " at " + frm.doc.custom_branch
      );
    }
  },
  project_type: function (frm) {
    if (frm.doc.custom_branch && frm.doc.project_type) {
      frm.set_value(
        "project_name",
        frm.doc.project_type +
        " at " +
        frm.doc.custom_zone_no +
        frm.doc.custom_branch_code
      );
    }
  },
  onload(frm) {
    frm.dashboard.hide();
    disable_add_and_delete_row(frm);
    request_transfer_button(frm);
    remove_buttons(frm);
  },
  refresh(frm) {
    frm.dashboard.hide();
    remove_buttons(frm);
    hide_sidebar_button(frm);
    custom_buttons(frm);
    calculate_total_allocate_amount(frm);
    update_disbursement_status_from_last_row(frm);
    update_addtional_request_status_from_last_row(frm);
    approve_and_reject_field_button(frm);
    scroll_to_fields(frm);
    if (frm.doc.workflow_state == "Final Project Planning" && !frm.doc.custom_disbursement_planning){
      fill_stages(frm);
    }
    bank_details_html(frm);
  },
  validate(frm){
    calculate_total_allocate_amount(frm);
    // calculate_disbursement_and_remaining(frm, true);
    // update_disbursement_status_from_last_row(frm);
    // update_addtional_request_status_from_last_row(frm); 
  },
  custom_project_allocated_amount(frm) {
  calculate_total_allocate_amount(frm);
  },
  custom_additional_require_amount(frm) {
    calculate_additional_required_amount(frm);
    calculate_total_allocate_amount(frm);
    // calculate_disbursement_and_remaining(frm, false);
  },
  custom_suggested_by_member_incharge_a__f(frm) {
    update_project_allocated_from_suggestion(frm);
  },
  custom_estimate_cost: function (frm){
    get_in_words(frm,"custom_estimate_cost","custom_estimate_cost_in_the_words");
    frm.set_value("custom_previously_suggested_code_of_mi", frm.doc.custom_estimate_cost);
  },
  custom_total_amount: function (frm){
    get_in_words(frm, "custom_total_amount", "custom_total_amount_in_words");
    if (frm.doc.custom_total_amount) {
      frm.set_value("custom_total_boq_amount", frm.doc.custom_total_amount);
    }
  },
  custom_total_estimated_cost: function (frm){
    get_in_words(frm,"custom_total_estimated_cost","custom_total_estimated_cost_in_site");
    if (frm.doc.custom_suggested_by_member_incharge_bm || frm.doc.custom_suggested_by_member_incharge_bm !== frm.doc.custom_total_estimated_cost) {
        frm.set_value('custom_suggested_by_member_incharge_bm', frm.doc.custom_total_estimated_cost);
    }
    if (!frm.doc.custom_suggested_by_member_incharge_pp || frm.doc.custom_suggested_by_member_incharge_pp === frm.doc.custom_total_estimated_cost) {
        frm.set_value('custom_suggested_by_member_incharge_pp', frm.doc.custom_total_estimated_cost);
    }
    if (!frm.doc.custom_suggested_by_secretory_snm || frm.doc.custom_suggested_by_secretory_snm === frm.doc.custom_total_estimated_cost) {
        frm.set_value('custom_suggested_by_secretory_snm', frm.doc.custom_total_estimated_cost);
    }
    if (!frm.doc.custom_suggested_by_member_incharge_a__f || frm.doc.custom_suggested_by_member_incharge_a__f === frm.doc.custom_total_estimated_cost) {
        frm.set_value('custom_suggested_by_member_incharge_a__f', frm.doc.custom_total_estimated_cost);
    }
  },
  custom_suggested_by_member_incharge_pp: function (frm) {get_in_words(frm,"custom_suggested_by_member_incharge_pp","custom_amount_in_words_in_pp");},
  custom_suggested_by_secretory_snm: function (frm) {get_in_words(frm,"custom_suggested_by_secretory_snm","custom_amount_in_words_snm");},
  custom_suggested_by_member_incharge_a__f: function (frm) {get_in_words(frm,"custom_suggested_by_member_incharge_a__f","custom_amount_in_words_a__f");},
  custom_project_allocated_amount: function (frm) {get_in_words(frm,"custom_project_allocated_amount","custom_project_allocated_amount_in_words");},
  custom_total_allocated_amount: function (frm) {get_in_words(frm,"custom_total_allocated_amount","custom_total_allocated_amount_in_words");},
  custom_disbursement_amount: function (frm) {get_in_words(frm,"custom_disbursement_amount","custom_disbursement_amount_in_words");},
  custom_remaining_amount: function (frm) {get_in_words(frm,"custom_remaining_amount","custom_remaining_amount_in_words");},
  custom_additional_require_amount: function (frm) {get_in_words(frm,"custom_additional_require_amount","custom_additional_require_amount_in_words");},
  custom_previously_suggested_code_of_mi: function (frm) {get_in_words(frm,"custom_previously_suggested_code_of_mi","custom_previously_suggested_by_in_words");},
  custom_approved_amount_by_a_and_finance: function (frm) {get_in_words(frm,"custom_approved_amount_by_a_and_finance","custom_approved_amount_by_a_and_finance_in_words");},
  custom_total_boq_amount: function (frm) {
    get_in_words(frm, "custom_total_boq_amount", "custom_total_amount_in_word");
    fill_stages(frm);
  },
  custom_suggested_by_member_incharge_bm: function (frm) {
    get_in_words(frm, "custom_suggested_by_member_incharge_bm", "custom_amount_in_words_in_bm");
  },
  custom_total_estimated_cost: function (frm) {
        // Check if the fields are not manually changed
  },
  async custom_land(frm){
    await land_summary_html(frm);
  },
});



// ON REFRESH EVENT
function remove_buttons(frm){
    console.log
    cur_frm.remove_custom_button("Set Project Status", "Actions");
    cur_frm.remove_custom_button("Duplicate Project with Tasks", "Actions");
    cur_frm.remove_custom_button("Update Total Purchase Cost", "Actions");
    cur_frm.remove_custom_button("Set Project Status", "Actions");
    cur_frm.remove_custom_button("Gantt Chart", "View");
    cur_frm.remove_custom_button("Kanban Board", "View");
    cur_frm.remove_custom_button("Update Costing and Billing", "Actions");
    frm.dashboard.hide();
    if (frm.timeline && frm.timeline.wrapper) {
      frm.timeline.wrapper.hide();
    }
    if (frm.fields_dict.__connections__) {
      frm.fields_dict.__connections__.wrapper.hide();
    }
}


frappe.ui.form.on("Estimate", {
  quantity: function (frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    if (row.quantity && row.rate) {
      row.amount = flt(row.quantity) * flt(row.rate);
      frm.refresh_field("estimate_items");
    }
    if (frm.doc.workflow_state === "Final Project Planning") {
      frm.doc.custom_total_boq_amount =
        frm.doc.custom_bill_of_quantities.reduce((sum, item) => {
          return sum + flt(item.amount);
        }, 0);
      frm.trigger("custom_total_boq_amount");
      frm.refresh_field("custom_total_boq_amount");
    } else if (
      frm.doc.workflow_state === "Member Incharge BM (Finance Approval)"
    ) {
      frm.doc.custom_total_estimated_cost =
        frm.doc.custom_bill_of_quantity_appoval.reduce((sum, item) => {
          return sum + flt(item.amount);
        }, 0);
      frm.trigger("custom_total_estimated_cost");
      frm.refresh_field("custom_total_estimated_cost");
    } else {
      frm.doc.custom_total_amount = frm.doc.custom_bill_of_quantity.reduce(
        (sum, item) => {
          return sum + flt(item.amount);
        },
        0
      );
      frm.trigger("custom_total_amount");
      frm.refresh_field("custom_total_amount");
    }
  },
  rate: function (frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    if (row.quantity && row.rate) {
      row.amount = flt(row.quantity) * flt(row.rate);
    }
    frm.refresh_field("custom_bill_of_quantity_approval");
    frm.refresh_field("custom_total_boq_amount");
    if (frm.doc.workflow_state === "Final Project Planning") {
      frm.doc.custom_total_boq_amount =
        frm.doc.custom_bill_of_quantities.reduce((sum, item) => {
          return sum + flt(item.amount);
        }, 0);
      frm.trigger("custom_total_boq_amount");
      frm.refresh_field("custom_total_boq_amount");
    } else if (
      frm.doc.workflow_state === "Member Incharge BM (Finance Approval)"
    ) {
      frm.doc.custom_total_estimated_cost =
        frm.doc.custom_bill_of_quantity_appoval.reduce((sum, item) => {
          return sum + flt(item.amount);
        }, 0);
      frm.trigger("custom_total_estimated_cost");
      frm.refresh_field("custom_total_estimated_cost");
    } else {
      frm.refresh_field("custom_bill_of_quantity");
      frm.doc.custom_total_amount = frm.doc.custom_bill_of_quantity.reduce(
        (sum, item) => {
          return sum + flt(item.amount);
        },
        0
      );
      frm.trigger("custom_total_amount");
      frm.refresh_field("custom_total_amount");
    }
  },
  amount: function (frm, cdt, cdn) {
    if (frm.doc.workflow_state === "Final Project Planning") {
      frm.doc.custom_total_boq_amount =
        frm.doc.custom_bill_of_quantities.reduce((sum, item) => {
          return sum + flt(item.amount);
        }, 0);
      frm.trigger("custom_total_boq_amount");
      frm.refresh_field("custom_total_boq_amount");
    } else if (
      frm.doc.workflow_state === "Member Incharge BM (Finance Approval)"
    ) {
      frm.doc.custom_total_estimated_cost =
        frm.doc.custom_bill_of_quantity_appoval.reduce((sum, item) => {
          return sum + flt(item.amount);
        }, 0);
      frm.trigger("custom_total_estimated_cost");
      frm.refresh_field("custom_total_estimated_cost");
    } else {
      frm.doc.custom_total_amount = frm.doc.custom_bill_of_quantity.reduce(
        (sum, item) => {
          return sum + flt(item.amount);
        },
        0
      );
      frm.trigger("custom_total_amount");
      frm.refresh_field("custom_total_amount");
    }
  },
});


frappe.ui.form.on("Custom Disbursement Detail", {
  custom_disbursement_detail_add: function (frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    const today = frappe.datetime.get_today();
    row.posted_on = today;
    refresh_field("custom_disbursement_detail");
  },
});

// ONLOAD EVENT
function request_transfer_button(frm) {
    frm.no_timeline = true;
    document
      .getElementById("request_transfer")
      .addEventListener("click", function () {
        {
          frappe.call({
            method:
              "bcms.building_construction_manufacturing_service.doctype.disbursement.disbursement.change_in_approve",
            args: {
              docname: document
                .getElementById("request_transfer")
                .getAttribute("data-name"),
              workflow_state: "Pending",
            },
            callback: function (r) {
              {
                frappe.set_route("Form","Disbursement",document.getElementById("request_transfer").getAttribute("data-name"));
                frm.reload_doc();
              }
            },
          });
      }
      });
  }


function hide_sidebar_button(frm){
  frappe.after_ajax(() => {
      setTimeout(() => {
        if (frm.page.sidebar) {
          const sidebar = frm.page.sidebar;

          sidebar.find('.sidebar-menu a:contains("See on Website")').hide();
          sidebar.find(".form-stats-likes").hide();
          sidebar.find(".comment-icon").hide();
          sidebar.find(".ml-2").hide();
          sidebar.find(".modified-by").hide();
          sidebar.find(".mx-2").hide();
          sidebar.find(".created-by").hide();
          sidebar.find(".comments").hide();
          sidebar.find(".form-tags").hide();
          sidebar.find(".form-shared").hide();
          sidebar.find(".icon-sm").hide();
          sidebar.find(".form-follow").hide();
          frm.page.wrapper.find(".comment-box").css({ display: "none" });
          $(".form-assignments").hide();
          frm.page.wrapper
            .find(".scroll-to-top btn btn-default icon-btn")
            .css({ display: "none" });
          frm.page.wrapper
            .find(".actions-btn-group:visible")
            .first()
            .css({ display: "none" });
        }
      }, 0);
    });
}


function approve_button_fun(frm) {
  frappe.call({
    method:
      "bcms.building_construction_manufacturing_service.customization.project.project.workflow_state",
    args: {
      docname: frm.doc.name,
      project_type: frm.doc.project_type,
      workflow_state: frm.doc.workflow_state,
    },
    callback: function (r) {
      console.log(r);
      if (r.message) {
        frappe.msgprint(__("Project Approved"));
        frm.reload_doc();
        frappe.set_route("List", "Project");
      }
    },
  });
}

function reject_button_fun(frm) {
  frm.doc.save();
  frappe.call({
    method:
      "bcms.building_construction_manufacturing_service.customization.project.project.reject_project",
    args: {
      docname: frm.doc.name,
      project_type: frm.doc.project_type,
      workflow_state: frm.doc.workflow_state,
    },
    callback: function (r) {
      if (r.message) {
        frappe.msgprint(__("Project Rejected"));
        frm.reload_doc();
        frappe.set_route("List", "Project");
      }
    },
  });
}

// ON REFRESH EVENT
function disable_add_and_delete_row(frm){
  frm.set_df_property("custom_land_detail_lc", "cannot_add_rows", true);
    frm.fields_dict["custom_land_detail_lc"].grid.add_new_row=()=>{};
    frm.fields_dict["custom_land_details_forms"].grid.add_new_row=()=>{};
    frm.fields_dict["custom_attachment_section_for_land_details"].grid.add_new_row=()=>{};
    frm.set_df_property("custom_land_detail_lc", "cannot_delete_rows", true);
    frm.set_df_property(
      "custom_attachment_section_for_land_details",
      "cannot_delete_rows",
      true
    );
    frm.set_df_property(
      "custom_land_details_forms",
      "cannot_delete_rows",
      true
    );
    frm.set_df_property("custom_land_details_forms", "cannot_add_rows", true);
    frm.set_df_property(
      "custom_attachment_section_for_land_details",
      "cannot_add_rows",
      true
    );
    frm.set_df_property(
      "custom_disbursement_detail",
      "cannot_delete_rows",
      true
    );
    frm.refresh_field("custom_disbursement_detail"); // this is tab
    

}
// REFRESH EVENT
function approve_and_reject_field_button(frm){
  const approved_fields = [
      "custom_approved",
      "custom_approved1",
      "custom_approved2",
      "custom_approved3",
      "custom_approved4",
      "custom_approved5",
      "custom_approved6",
      "custom_approved7",
      "custom_approved_8",
      "custom_approved_9",
      "custom_approved_10",
    ];
    const reject_fields = [
      "custom_reject",
      "custom_reject1",
      "custom_reject2",
      "custom_reject3",
      "custom_reject4",
      "custom_reject5",
      "custom_reject6",
      "custom_reject7",
      "custom_reject_8",
      "custom_reject_9",
      "custom_reject_10",
    ];

    setTimeout(() => {
      approved_fields.forEach((field) => {
        let btn = frm
          .get_field(field)
          .$wrapper.find("button.btn.btn-xs.btn-default");
        if (btn.length) {
          btn.css({
            "background-color": "#008000",
            "border-color": "#008000",
            color: "white",
            "font-weight": "bold",
          });
          btn.off("click");
          btn.on("click", () => {
            approve_button_fun(frm);
          });
        }
      });
    }, 500);

    setTimeout(() => {
      reject_fields.forEach((field) => {
        const wrapper = frm.get_field(field).$wrapper;

        let btn = wrapper.find("button");

        if (btn.length) {
          btn.css({
            "background-color": "#ff0000",
            "border-color": "#ff0000",
            color: "white",
            "font-weight": "bold",
          });

          btn.off("click");
          btn.on("click", () => {
            reject_button_fun(frm);
          });
        }
      });
    }, 500);
}

// ON REFRESH EVENT
function custom_buttons(frm){
  if (
      !frm.is_new() &&
      frm.doc.workflow_state !== "Work completion Certificate"
    ) {
      const apr_btn = frm.add_custom_button(__("Approve"), function () {
        if (frm.is_dirty()) {
          frm.save();
        }
        frappe.call({
          method:
            "bcms.building_construction_manufacturing_service.customization.project.project.workflow_state",
          args: {
            docname: frm.doc.name,
            project_type: frm.doc.project_type,
            workflow_state: frm.doc.workflow_state,
          },
          callback: function (r) {
            if (r.message) {
              // open_custom_dialog(r.message);
              frappe.msgprint(__("Project Approved"));
              frm.reload_doc();
              frappe.set_route("List", "Project");
            }
          },
        });
      });
      apr_btn.css({
        "background-color": "Green",
        color: "White",
        "font-weight": "bold",
      });
    }
    if (
      !frm.is_new() &&
      frm.doc.workflow_state !== "Project Request" &&
      frm.doc.workflow_state !== "Work completion Certificate"
    ) {
      const rj_btn = frm.add_custom_button(__("Reject"), function () {
        frappe.call({
          method:
            "bcms.building_construction_manufacturing_service.customization.project.project.reject_project",
          args: {
            docname: frm.doc.name,
            project_type: frm.doc.project_type,
            workflow_state: frm.doc.workflow_state,
          },
          callback: function (r) {
            if (r.message) {
              console.log(r);
              frappe.msgprint(__("Project Rejected"));
              frm.reload_doc();
              frappe.set_route("List", "Project");
            }
          },
        });
      });
      rj_btn.css({
        "background-color": "Red",
        color: "White",
        "font-weight": "bold",
      });
    }
    if (
      !frm.is_new() &&
      frm.doc.workflow_state !== "Work completion Certificate"
    ) {
      const r_review_btn = frm.add_custom_button(__("Review"), function () {
        const dialog = new frappe.ui.Dialog({
          title: __("Request For Review"),
          fields: [
            {
              fieldname: "adhikari",
              fieldtype: "Link",
              options: "Employee",
              label: __("Adhikari"),
              reqd: 1,
            },
            {
              fieldname: "remarks",
              fieldtype: "Small Text",
              label: __("Remarks"),
              reqd: 1,
            },
          ],
        });
        dialog.show();
      });

      r_review_btn.css({
        "background-color": "DarkBlue",
        color: "White",
        "font-weight": "bold",
      });
      if (
        !frm.is_new() &&
        frm.doc.workflow_state !== "Project Request" &&
        frm.doc.workflow_state !== "Work completion Certificate"
      ) {
        const dis_btn = frm.add_custom_button(
          __("Additional Fund Request"),
          function () {
            frappe.new_doc("Additional Fund Request", {
              project: frm.doc.name,
              project_name: frm.doc.project_name,
              project_type: frm.doc.project_type,
              branch: frm.doc.custom_branch,
              status: frm.doc.status,
            });
          }
        );
        dis_btn.css({
          "background-color": "Black",
          color: "White",
          "font-weight": "bold",
        });
      }
    }
    if (frm.doc.project_type == "Maintenance") {
      frm.add_custom_button(
        "Material Transfer",
        () => {
          frappe.model.open_mapped_doc({
            method:
              "bcms.building_construction_manufacturing_service.customization.project.project.create_stock_entry_from_project",
            frm: frm,
          });
        },
        "Create"
      );
      frm.add_custom_button(
        "Material Consumeption",
        () => {
          frappe.model.open_mapped_doc({
            method:
              "bcms.building_construction_manufacturing_service.customization.project.project.create_stock_entry_from_project",
            frm: frm,
          });
        },
        "Create"
      );
      frm.add_custom_button(
        "Material Return",
        () => {
          frappe.model.open_mapped_doc({
            method:
              "bcms.building_construction_manufacturing_service.customization.project.project.create_stock_entry_from_project",
            frm: frm,
          });
        },
        "Create"
      );
    }
}


function setup_disbursement_events(frm) {
  if (!frm.custom_disbursement_events_setup) {
    setTimeout(() => {
      const field = frm.fields_dict.custom_disbursement_detail;
      if (field && field.grid && typeof field.grid.on === "function") {
        field.grid.on("child_change", () => {
          // calculate_disbursement_and_remaining(frm, false);
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
      if (field && field.grid && typeof field.grid.on === "function") {
        field.grid.on("child_change", () => {
          // calculate_disbursement_and_remaining(frm, false);
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
  (frm.doc.custom_additional_request_details || []).forEach((row) => {
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
    frm
      .set_value("custom_additional_require_amount", total)
      .then(() => frm.dirty());
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
    frm
      .set_value("custom_total_allocated_amount", total)
      .then(() => frm.dirty());
  }

  // calculate_disbursement_and_remaining(frm, false);
}


// function calculate_disbursement_and_remaining(frm, validate_rows) {
//   const total_allocated = flt(frm.doc.custom_total_allocated_amount);
//   let total_approved = 0;

//   for (const row of frm.doc.custom_disbursement_detail || []) {
//     if (row.current_state !== "Disbursed") continue;
//     const today = frappe.datetime.get_today();
//     if (!row.approved_on || row.approved_on !== today) {
//       row.approved_on = today;
//       updated = true;
//     }
//     const approved = flt(row.approved_amount);
//     const requested = flt(row.requested_amount);

//     if (validate_rows && approved > requested) {
//       frappe.throw(
//         `Row ${row.idx}: Approved Amount (${approved}) cannot be greater than Requested Amount (${requested}).`
//       );
//     } else if (!validate_rows && approved > requested) {
//       frappe.msgprint(
//         `Row ${row.idx}: Approved > Requested. Resetting approved_amount to 0.`
//       );
//       row.approved_amount = 0;
//     }

//     total_approved += row.approved_amount;
//   }

//   if (frm.doc.custom_disbursement_amount !== total_approved) {
//     frm
//       .set_value("custom_disbursement_amount", total_approved)
//       .then(() => frm.dirty());
//   }

//   if (total_approved > total_allocated) {
//     const msg = "Total Disbursement exceeds Total Allocated Amount.";
//     if (validate_rows) {
//       frappe.throw(msg);
//     } else {
//       frappe.msgprint(msg);
//     }
//     calculate_disbursement_and_remaining;
//   }

//   const remaining = total_allocated - total_approved;

//   if (frm.doc.custom_remaining_amount !== remaining) {
//     frm
//       .set_value("custom_remaining_amount", remaining)
//       .then(() => frm.dirty());
//   }

//   if (
//     remaining === 0 &&
//     frm.doc.workflow_state === "Under Disbursement" &&
//     frm.doc.custom_disbursement_detail &&
//     frm.doc.custom_disbursement_detail.length > 0 &&
//     frm.doc.__islocal !== 1
//   ) {
//     frm
//       .set_value("workflow_state", "Work completion Certificate")
//       .then(() => {
//         frm.dirty();
//       });
//   }
// }

function update_disbursement_status_from_last_row(frm) {
  const disbursements = frm.doc.custom_disbursement_detail || [];

  if (disbursements.length > 0) {
    const last_row = disbursements[disbursements.length - 1];
    const status = last_row.current_state || "";

    if (frm.doc.custom_disbursement_status !== status) {
      frm
        .set_value("custom_disbursement_status", status)
        .then(() => frm.dirty());
    }
  } else {
    if (frm.doc.custom_disbursement_status) {
      frm
        .set_value("custom_disbursement_status", "")
        .then(() => frm.dirty());
    }
  }
}

function update_addtional_request_status_from_last_row(frm) {
  const disbursements = frm.doc.custom_additional_request_details || [];

  if (disbursements.length > 0) {
    const last_row = disbursements[disbursements.length - 1];
    const status = last_row.current_state || "";

    if (frm.doc.custom_additional_request_status !== status) {
      frm
        .set_value("custom_additional_request_status", status)
        .then(() => frm.dirty());
    }
  } else {
    if (frm.doc.custom_additional_request_status) {
      frm
        .set_value("custom_additional_request_status", "")
        .then(() => frm.dirty());
    }
  }
}

function update_project_allocated_from_suggestion(frm) {
  const value = flt(frm.doc.custom_suggested_by_member_incharge_a__f);
  if (frm.doc.custom_project_allocated_amount !== value) {
    frm
      .set_value("custom_project_allocated_amount", value)
      .then(() => frm.dirty());
  }
}

function get_in_words(frm, source_field, target_field) {
  const value = frm.doc[source_field];
  if (value) {
    frappe.call({
      method:
        "bcms.building_construction_manufacturing_service.customization.project.project.get_amount_in_words",
      args: { amount: value },
      callback: function (r) {
        if (r.message) {
          frm.set_value(target_field, r.message);
        }
      },
    });
  } else {
    frm.set_value(target_field, "");
  }
}

// // Refresh EVENT
// function add_empty_row(frm){
//     function add_if_empty(child_table_fieldname, child_doctype, default_values = {}) {
//                 if (!frm.doc[child_table_fieldname] || frm.doc[child_table_fieldname].length === 0) {
//                     let child = frappe.model.add_child(frm.doc, child_doctype, child_table_fieldname);
//                     Object.assign(child, default_values); // apply default values if provided
//                     frm.refresh_field(child_table_fieldname);
//                 }
//               }
//   add_if_empty('custom_recommendation_letters', 'Recommendation Letter');
//   add_if_empty('custom_site_plan', 'Site Plan');
//   add_if_empty('custom_nearest_branch_details','Nearest Branch Details');
//   add_if_empty('custom_details_of_sangat_','DETAILS OF SANGAT');
//   add_if_empty('custom_details_of_sewadal_details','DETAILS OF SEWADAL DETAILS');
//   add_if_empty('custom_blood_donation_record','Blood Donation Record'); 
//   add_if_empty('custom_bill_of_quantity','Bill of Quantity');
//   add_if_empty('custom_financiallll_approval','Financial Approval');
//   add_if_empty('custom_construction_committee_','Construction Committee');
//   add_if_empty('custom_land_details1', 'Land Details');
//   add_if_empty('custom_standard_planning_and_designing111111', 'Standard Planning and Designing');
//   add_if_empty('custom_drawing_covering_letter11111', 'Drawing Covering Letter');
//   add_if_empty('custom_drawing_file_all_blocks11', 'Attach Image for Govt Drawing File');
//   add_if_empty('custom_boq_estimate11', 'BOQ/ Estimate');
//   add_if_empty('custom_govt_approval_letter11111', 'Attach Image for Govt Approval');
//   add_if_empty('custom_govt_approved_drawing_file11', 'Attach Image for Govt Drawing File');
//   add_if_empty('custom_financial_approval_form111', 'Financial Approval Form');
//   add_if_empty('custom_construction_committee_form11','Construction Committee Form');
//   add_if_empty('custom_proforma_for_sadh_sangat_attach','Proforma for Sadh Sangat attach');
//   add_if_empty('custom_work_completion_certificate11','Virtual Work Completion Certificate');
//   add_if_empty('custom_actual_work_completion_certificate','Actual Work Completion Certificate');
//   add_if_empty('custom_completion_attachment','Completion Attachment');

// }

// function add_default_if_empty(frm){
//   function add_default_rows_if_empty(child_table_fieldname, child_doctype, default_values_list = []) {
//   if (!frm.doc[child_table_fieldname] || frm.doc[child_table_fieldname].length === 0) {
//     for (let default_values of default_values_list) {
//       let child = frappe.model.add_child(frm.doc, child_doctype, child_table_fieldname);
//       Object.assign(child, default_values);
//     }
//     frm.refresh_field(child_table_fieldname);
//   }
//   }
//   console.log(":::::::::::::::::::::::::::")
//   const default_rows = [
// 			{ land_details: "Any River , Nalla, Railway lines, HT electricity line in KVA." },
// 			{ land_details: "Temporary Electricity Connection install at site" },
// 			{ land_details: "Land inspection ion by supervisor /Engineer of Building Department & Demarcation done by Supervisor /Engineer." },
// 			{ land_details: "Drawing approval procedure from local Garam Panchayat/ Municipal Council/ Town Planner & other government departments." },
// 			{ land_details: "Type of Soil."},
// 			{ land_details: "Land level should be mentioned in letter."},
// 			{ land_details: "Boundary Wall Construction work completed."}
//     	]
// 				const default_row = [
// 		    { land_details: "Land possession of Sant Nirankari Mandal."},
// 		    { land_details: "Land is free from the court case & other dispute."},
// 		];
// 		const attach_rows = [
// 		     { land_detail: "NOC approval procedure from National Highway Authorities."},
// 		     { land_detail: "Setback for Bhavan Construction as per LGA and NSH."},
// 		 ];
//     if(frm.doc.workflow_state == "Planning & Designing"){
//     		add_default_rows_if_empty('custom_land_details_forms', 'Land Details Form', default_rows);
//     		add_default_rows_if_empty('custom_attachment_section_for_land_details','Attachment section for Land details', attach_rows);
//         }
// 		if(frm.doc.workflow_state == "Land Clearance"){
//     		add_default_rows_if_empty('custom_land_detail_lc', 'Land Details', default_row);
// 		}
// }

function scroll_to_fields(frm){
  if (frm.doc.workflow_state == "Project Request"){
      frm.scroll_to_field("project_type")
  }
  else if (frm.doc.workflow_state == "Land Clearance"){
      frm.scroll_to_field("custom_is_form_land_details")
  }
  else if (frm.doc.workflow_state == "Planning & Designing"){
      frm.scroll_to_field("custom_land_details_forms")
  }
  else if (frm.doc.workflow_state == "Drawing Approval"){
      frm.scroll_to_field("custom_govt_approval_letter11111")
  }
  else if (["Member Incharge BM (Finance Approval)", "Member Incharge PP (Financial Approval)", "Secretary (Financial Approval)", "Member Incharge A&F(Financial Approval)"].includes(frm.doc.workflow_state)){
      frm.scroll_to_field("custom_is_form_financial")
  }
  else if (frm.doc.workflow_state == "Construction Committee Formed"){
      frm.scroll_to_field("custom_is_form_committee")
  }
  else if (frm.doc.workflow_state == "Under Disbursement"){
      frm.scroll_to_field("custom_preview_disbursement_details")
  }
  else if (frm.doc.workflow_state == "Final Project Planning"){
      frm.scroll_to_field("custom_bill_of_quantities")
  }

}
 
async function land_summary_html (frm) {
  if (!frm.doc.custom_land) return;

  try {
    const land = await frappe.db.get_doc("Land Details", frm.doc.custom_land);

    let branch_code = "";
    let zone_no = "";
    let zone_name = "";
    let zonal_incharge = "";
    let mobile_no = "";
    let bhavan_name = "";

    if (land.branch) {
      const branch = await frappe.db.get_doc("Branch", land.branch);
      branch_code = branch.custom_branch_code || "";
    }

    if (land.zone) {
      const zone = await frappe.db.get_doc("Zone", land.zone);
      zone_no = zone.zone_no || "";
      zone_name = zone.zone_name || "";
      zonal_incharge = zone.zonal_incharge || "";
      if (zonal_incharge) {
        const adhikari = await frappe.db.get_doc("Employee", zonal_incharge);
        mobile_no = adhikari.cell_number || "";
      }
    }

    if (land.bhavan) {
      const bhavan = await frappe.db.get_doc("Bhavan", land.bhavan);
      bhavan_name = bhavan.bhavan_name || land.bhavan;
    }

    const html = `
              <table style="border-collapse: collapse; width: 100%;" border="1">
                  <tr><td colspan="2" style="padding: 8px;text-align:center"><b>Land Deatils</b></td></tr>
                  <tr><td style="padding: 8px;">Branch</td><td style="padding: 8px;">${land.branch || ""
      }</td></tr>
                  <tr><td style="padding: 8px;">Branch Code</td><td style="padding: 8px;">${branch_code}</td></tr>
                  <tr><td style="padding: 8px;">Bhawan</td><td style="padding: 8px;">${bhavan_name}</td></tr>
                  <tr><td style="padding: 8px;">Zone</td><td style="padding: 8px;">${land.zone || ""
      }</td></tr>
                  <tr><td style="padding: 8px;">Zone No</td><td style="padding: 8px;">${zone_no}</td></tr>
                  <tr><td style="padding: 8px;">Zone Name</td><td style="padding: 8px;">${zone_name}</td></tr>
                  <tr><td style="padding: 8px;">Zonal Incharge</td><td style="padding: 8px;">${zonal_incharge}</td></tr>
                  <tr><td style="padding: 8px;">Mobile No</td><td style="padding: 8px;">${mobile_no}</td></tr>
              </table>
          `;

    frm.set_value("custom_land_summarys", html);
    frm.set_df_property("custom_land_summarys", "read_only", 1);
    frm.refresh_field("custom_land_summarys");
  } catch (error) {
    frappe.msgprint(__("Error fetching land details: ") + error.message);
  }
}

function fill_stages(frm) {
  if (!frm.doc.project_type || !frm.doc.custom_total_boq_amount) return;

  frappe.call({
    method: "frappe.client.get",
    args: {
      doctype: "Project Type",
      name: frm.doc.project_type,
    },
    callback: function (r) {
      if (r.message && Array.isArray(r.message.custom_percentage)) {
        const total_amount = frm.doc.custom_total_boq_amount;
        frm.clear_table("custom_disbursement_planning");

        r.message.custom_percentage.forEach((row) => {
          if (row.stages && row.percentage != null) {
            const amount = (parseFloat(row.percentage) / 100) * total_amount;
            frm.add_child("custom_disbursement_planning", {
              state: row.stages,
              percentage: row.percentage,
              amount: amount.toFixed(2),
            });
          }
        });
        frm.refresh_field("custom_disbursement_planning");
      }
    },
  });
}



function bank_details_html(frm) {
    
    if (
      (!frm.is_new() && frm.doc.workflow_state == "Under Disbursement")  ||
      frm.doc.workflow_state == "Work completion Certificate"
    ) {
      let html = `<table style="width: 100%; font-size: 14px;" border="1">
      <tr>
      <tr>
      <td style="padding: 8px;"><b>Branch Bank Account Name</b></td>
      <td style="padding: 8px;"><b>Branch Bank Account Number</b></td>
      <td style="padding: 8px;"><b>Civil Engineer/Draftsman/Architect Number</b></td>
      <td style="padding: 8px;"><b>Civil Engineer/Draftsman/Architect Name</b></td>
      </tr>
      </tr>
      <tr>
      <td style="padding: 8px;">${frm.doc.custom_branch_bank_account_name}</td>
      <td style="padding: 8px;">${frm.doc.custom_branch_bank_account_number}</td>
      <td style="padding: 8px;">${frm.doc.custom_civil_engineerdraftsmanarchitect_number || ""}</td>
      <td style="padding: 8px;">${frm.doc.custom_civil_engineerdraftsmanarchitect_name}</td>
      </tr>`;
      html += ` </tbody>
      </table>`;

      frm.set_value("custom_bank_details", html);
    }
}

frappe.ui.form.on("Labour Details", {
  amount: function (frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    if (row.amount) {
      frm.refresh_field("custom_labour_details");
    }
    let total = 0;
    frm.doc.custom_labour_details.forEach(function (item) {
      total += flt(item.amount);
    });
    frm.doc.custom_labour_total_amount = total;
    frm.refresh_field("custom_labour_total_amount");
  },
});

frappe.ui.form.on("Disbursement Planning", {
  expected_start_date: function (frm, cdt, cdn) {
    update_date(frm);
  },
  expected_end_date: function (frm, cdt, cdn) {
    update_date(frm);
  },
});

function update_date(frm) {
  let child_table = frm.doc.custom_disbursement_planning || [];
  child_table.sort((a, b) => (a.idx || 0) - (b.idx || 0));

  if (child_table.length && child_table[0].expected_start_date) {
    frm.set_value(
      "custom_expected_start_dates",
      child_table[0].expected_start_date
    );
  } else {
    frm.set_value("custom_expected_start_dates", null);
  }

  if (
    child_table.length &&
    child_table[child_table.length - 1].expected_end_date
  ) {
    frm.set_value(
      "custom_expected_end_dates",
      child_table[child_table.length - 1].expected_end_date
    );
  } else {
    frm.set_value("custom_expected_end_dates", null);
  }
}
//added by mansi
// function open_custom_dialog() {
//       let d = new frappe.ui.Dialog({
//           title: 'Custom Dialog',
//           fields: [
//               {
//                   label: 'You Want To Review?',
//                   fieldname: 'review',
//                   fieldtype: 'Check'
//               }
//           ],
//           primary_action_label: 'Yes',
//           primary_action(values) {
//               console.log(values);
//               d.hide();
//           },
//           secondary_action_label: 'No',
//           secondary_action_label(values) {
//               console.log(values);
//               d.hide();
//           }
//       });
//       d.show();
//   }
