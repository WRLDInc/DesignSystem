<?php
/**
 * WRLD.host - adds {$wrld_ticket_history} to Support Ticket Reply emails.
 * Drop into /includes/hooks/wrld_ticket_history.php
 *
 * WHMCS has no native merge field for prior replies, which is why clients lose context.
 * This builds a compact, newest-first thread (excluding the reply being sent) and exposes it
 * to the "Support Ticket Reply" and "Support Ticket Opened" templates.
 */
use WHMCS\Database\Capsule;

add_hook('EmailPreSend', 1, function (array $vars) {
    $templates = ['Support Ticket Reply', 'Support Ticket Opened', 'Support Ticket Auto Close Notification'];
    if (!in_array($vars['messagename'], $templates, true)) {
        return [];
    }
    $ticketId = (int) $vars['relid'];
    if ($ticketId <= 0) {
        return ['wrld_ticket_history' => ''];
    }

    $limit = 6; // most recent replies shown; older ones stay in the client area
    $ticket = Capsule::table('tbltickets')->where('id', $ticketId)->first();
    if (!$ticket) {
        return ['wrld_ticket_history' => ''];
    }

    $rows = Capsule::table('tblticketreplies')
        ->where('tid', $ticketId)
        ->orderBy('date', 'desc')
        ->limit($limit + 1)
        ->get();

    // The newest reply is the one this email is about; the template already shows it as {$ticket_message}.
    $rows = $rows->slice(1);

    $items = [];
    foreach ($rows as $r) {
        $who = $r->admin ? htmlspecialchars($r->admin) : htmlspecialchars($r->name ?: 'You');
        $when = date('D, M j \a\t g:i A T', strtotime($r->date));
        $msg = nl2br(htmlspecialchars(trim($r->message)));
        $items[] = '<div class="wrld-msg" style="border-top:1px solid #e4e4e7;padding:14px 0;">'
            . '<p style="font-weight:600;margin:0 0 2px 0;color:#18181b;font-size:13px;">' . $who
            . ' <span style="font-weight:400;color:#71717a;">&nbsp;' . $when . '</span></p>'
            . '<div style="margin-top:6px;color:#52525b;">' . $msg . '</div></div>';
    }
    // Original request goes last (oldest)
    $who = htmlspecialchars($ticket->name ?: 'You');
    $when = date('D, M j \a\t g:i A T', strtotime($ticket->date));
    $items[] = '<div class="wrld-msg" style="border-top:1px solid #e4e4e7;padding:14px 0;">'
        . '<p style="font-weight:600;margin:0 0 2px 0;color:#18181b;font-size:13px;">' . $who
        . ' <span style="font-weight:400;color:#71717a;">&nbsp;' . $when . '</span></p>'
        . '<div style="margin-top:6px;color:#52525b;">' . nl2br(htmlspecialchars(trim($ticket->message))) . '</div></div>';

    return ['wrld_ticket_history' => implode('', $items)];
});
