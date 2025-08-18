import { useEffect } from "react";

const KitchenTicket = ({ orderInfo, setShowKitchenTicket }) => {
  useEffect(() => {
    if (orderInfo) {
      printKOT();
      setShowKitchenTicket(false);
    }
  }, [orderInfo, setShowKitchenTicket]);

  const printKOT = () => {
    try {
      // --- Data extraction from props ---
      const orderId = `#${Math.floor(new Date(orderInfo.orderDate).getTime())}`;
      const kot = orderInfo.kotNumber || `KOT-${Math.floor(Date.now() / 1000)}`;
      const tableNo = orderInfo.table?.tableNo ?? orderInfo.tableNo ?? "N/A";
      const logoUrl = `${window.location.origin}/point-of-service.png`;
      const items = orderInfo.items || [];
      let itemsRows = "";
      let totalQty = 0;

      // --- Building the HTML for the item rows ---
      items.forEach((it, idx) => {
        const qty = Number(it.quantity || 0);
        totalQty += qty;
        itemsRows += `
          <tr>
            <td style="width:28px;vertical-align:top">${idx + 1}</td>
            <td style="vertical-align:top;font-weight:700">${it.name.replace(
              /</g,
              "&lt;"
            )}</td>
            <td style="text-align:center;width:50px;vertical-align:top">${qty}</td>
          </tr>`;
      });

      const html = `
        <html>
          <head>
            <title>Kitchen Order Ticket</title>
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; padding:8px; color:#000; }
              .header { text-align:center; margin-bottom:6px }
              .logo { width:56px; height:56px; object-fit:contain; margin:0 auto 6px }
              .title { font-size:14px; font-weight:900; letter-spacing:1px }
              .meta { font-size:12px; margin-top:6px }
              table { width:100%; border-collapse: collapse; margin-top:8px; }
              td { font-size:13px; padding:4px 0; }
              .note { margin-top:8px; font-size:12px; color:#333 }
              .footer { margin-top:10px; font-size:11px; color:#666; text-align:center }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="${logoUrl}" class="logo" onerror="this.style.display='none'" />
              <div class="title">KITCHEN ORDER TICKET</div>
            </div>
            <div style="text-align:center;margin-top:4px;">
              <div style="font-size:14px;font-weight:900">Order: <span style="font-family:monospace;">${orderId}</span></div>
              <div style="font-size:18px;font-weight:900;margin-top:6px;">TABLE: ${tableNo}</div>
              <div style="font-size:13px;margin-top:4px;">KOT: <span style="font-weight:800">${kot}</span></div>
            </div>
            <div style="border-top:1px dashed #444;margin:8px 0"></div>
            <table>
              <thead>
                <tr>
                  <th style="width:28px;text-align:left;font-size:12px;padding:6px 0">No.</th>
                  <th style="text-align:left;font-size:12px;padding:6px 0">Item</th>
                  <th style="text-align:center;width:50px;font-size:12px;padding:6px 0">Qty.</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
            <div style="margin-top:8px;font-size:12px"><strong>Total Qty:</strong> ${totalQty}</div>
            <div class="note">Notes: Please prioritize hot items. Mark ready on completion.</div>
            <div class="footer">Auto-generated KOT — kitchen copy</div>
          </body>
        </html>
      `;

      // --- Opening the print window and writing the content ---
      const win = window.open("", "_blank", "width=260,height=600");
      if (win) {
        win.document.open();
        win.document.write(html);
        win.document.close();
        setTimeout(() => {
          win.print();
          win.close();
        }, 500);
      } else {
        alert("Please allow popups to print the Kitchen Ticket.");
      }
    } catch (err) {
      console.error("Kitchen print failed", err);
    }
  };

  return null;
};

export default KitchenTicket;
