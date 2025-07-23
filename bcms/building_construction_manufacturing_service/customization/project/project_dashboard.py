from frappe import _


def get_data(data=None):
    return {
        "heatmap": True,
        "heatmapmessage": ("This is based on the Time Sheets created against this project"),
        "fieldname": "project",
        "transactions": [
            {
                "label": _("Project"),
                "items": ["Disbursement","Stock Entry"],
            },

        ],
    }