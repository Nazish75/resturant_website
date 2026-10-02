// ================= SUPABASE CONFIG =================
// This is a Supabase publishable key. It is designed to be used in frontend apps.
const SUPABASE_URL = "https://xeejxflnksleqnxxrhvr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_P90m502Pt4mHkgLZmWESgw_fxh56qY7";
const SUPABASE_ORDERS_TABLE = "orders";

// ================= ORDER SUBMISSION =================
async function submitRestaurantOrder(event) {
    event.preventDefault();

    const form = document.getElementById("orderForm");
    const button = document.getElementById("orderSubmit");
    const message = document.getElementById("orderMessage");

    const data = {
        customer_name: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dish: document.getElementById("dish").value,
        quantity: Number(document.getElementById("quantity").value),
        service_type: document.getElementById("serviceType").value,
        address: document.getElementById("address").value.trim(),
        notes: document.getElementById("notes").value.trim() || null
    };

    if (!data.customer_name || !data.phone || !data.dish || !data.quantity || !data.address) {
        message.className = "order-message error";
        message.textContent = "Please fill in all required fields.";
        return;
    }

    button.disabled = true;
    button.textContent = "SENDING ORDER...";
    message.className = "order-message";
    message.textContent = "";

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_ORDERS_TABLE}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_PUBLISHABLE_KEY,
                "Authorization": `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
                "Prefer": "return=minimal"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            let details = "";
            try {
                const errorData = await response.json();
                details = errorData.message || errorData.hint || errorData.error || "";
            } catch (_) {}
            throw new Error(details || `Supabase returned ${response.status}`);
        }

        message.className = "order-message success";
        message.textContent = "Your order has been submitted successfully! We will contact you soon.";
        form.reset();
        document.getElementById("quantity").value = 1;
    } catch (error) {
        console.error("Supabase order error:", error);
        message.className = "order-message error";
        message.textContent = "Order could not be saved. Please check your Supabase table/RLS setup and try again.";
    } finally {
        button.disabled = false;
        button.textContent = "PLACE ORDER →";
    }
}

// ================= WEBSITE SHARE =================
async function shareRestaurantWebsite() {
    const shareData = {
        title: "Tandoori Restaurant",
        text: "Check out this restaurant website!",
        url: window.location.href
    };

    const message = document.getElementById("shareMessage");

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            message.textContent = "Website share menu opened successfully.";
        } else {
            await navigator.clipboard.writeText(window.location.href);
            message.textContent = "Website link copied. Now paste it in WhatsApp or another app.";
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            message.textContent = "Share is not available here. Please open the website in Chrome/Edge.";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("orderForm");
    if (form) {
        form.addEventListener("submit", submitRestaurantOrder);
    }
});
