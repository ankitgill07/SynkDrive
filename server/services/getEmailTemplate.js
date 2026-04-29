

export const getEmailTemplate = ({ user, file, permission, url }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shared file on SynkDrive</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #f0f2f5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      padding: 40px 16px;
      min-height: 100vh;
    }
    .wrapper { max-width: 560px; margin: 0 auto; }

    /* Header logo area */
    .logo-area { text-align: center; margin-bottom: 24px; }
    .logo-label {
      display: block;
      font-size: 13px;
      color: #6b7280;
      margin-top: 8px;
      font-weight: 500;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    /* Main card */
    .card {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 0.5px solid #e5e7eb;
    }

    /* Blue header */
    .card-header {
      background: #0061FF;
      padding: 32px 40px 28px;
    }
    .sender-row { display: flex; align-items: center; gap: 14px; }
    .avatar {
      width: 46px; height: 46px;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 17px; font-weight: 600; color: #ffffff;
      flex-shrink: 0;
    }
    .header-title {
      font-size: 18px; font-weight: 600; color: #ffffff; line-height: 1.3;
    }
    .header-sub { font-size: 13px; color: rgba(255,255,255,0.75); margin-top: 4px; }

    /* Body */
    .card-body { padding: 32px 40px; }
    .intro-text { font-size: 15px; color: #374151; line-height: 1.7; margin-bottom: 24px; }
    .sender-name { font-weight: 600; color: #111827; }
    .sender-email { color: #6b7280; font-size: 13px; margin-left: 4px; }
    .permission-badge {
      display: inline-flex; align-items: center; gap: 4px;
      background: #eff6ff; color: #1d4ed8;
      font-size: 12px; font-weight: 600;
      padding: 2px 10px; border-radius: 20px;
      border: 1px solid #bfdbfe;
      vertical-align: middle;
    }

    /* File card */
    .file-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px 20px;
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 28px;
    }
    .file-icon {
      width: 42px; height: 42px;
      background: #dbeafe; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .file-name {
      font-size: 15px; font-weight: 600; color: #111827;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .file-meta { font-size: 12px; color: #9ca3af; margin-top: 2px; }

    /* CTA button */
    .cta-btn {
      display: block; text-align: center;
      background: #0061FF; color: #ffffff;
      text-decoration: none;
      font-size: 15px; font-weight: 600;
      padding: 14px 24px; border-radius: 10px;
      letter-spacing: 0.01em;
    }
    .cta-btn:hover { background: #0052d9; }
    .cta-note {
      font-size: 13px; color: #9ca3af;
      text-align: center; line-height: 1.6;
      margin-top: 20px;
    }

    /* Footer strip */
    .card-footer {
      border-top: 1px solid #f1f5f9;
      padding: 20px 40px;
      background: #fafafa;
      display: flex; align-items: center; gap: 10px;
    }
    .footer-note { font-size: 12px; color: #9ca3af; line-height: 1.5; }

    /* Below card */
    .bottom-info { text-align: center; margin-top: 24px; }
    .bottom-info p { font-size: 12px; color: #9ca3af; margin-bottom: 6px; }
    .bottom-info a { color: #6b7280; text-decoration: none; }
    .divider { color: #d1d5db; margin: 0 8px; }

    @media (max-width: 600px) {
      .card-header, .card-body, .card-footer { padding-left: 20px; padding-right: 20px; }
    }
  </style>
</head>
<body>
<div class="wrapper">

  <!-- Logo -->
  <div class="logo-area">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#0061FF"/>
      <path d="M10 10L16 14.5L22 10L16 5.5L10 10Z" fill="white"/>
      <path d="M4 14.5L10 19L16 14.5L10 10L4 14.5Z" fill="white"/>
      <path d="M22 10L16 14.5L22 19L28 14.5L22 10Z" fill="white"/>
      <path d="M16 14.5L10 19L16 23.5L22 19L16 14.5Z" fill="white" opacity="0.85"/>
    </svg>
    <span class="logo-label">SynkDrive</span>
  </div>

  <!-- Card -->
  <div class="card">

    <!-- Blue header -->
    <div class="card-header">
      <div class="sender-row">
        <div class="avatar">
   <img 
                        src="${user.picture}" 
                        alt="${user.name}" 
                        width="50" 
                        height="50"
                        style="display:block; border-radius:50%; object-fit:cover;"
                      />
        </div>
        <div>
          <p class="header-title">${user.name} shared a file with you</p>
          <p class="header-sub">via SynkDrive</p>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <p class="intro-text">
        <strong class="sender-name">${user.name}</strong>
        <span class="sender-email">${user.email}</span>
        has invited you to
        <span class="permission-badge">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M8 3l3 3-3 3" stroke="#1d4ed8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          ${permission}
        </span>
        the following file:
      </p>

      <!-- File card -->
      <div class="file-card">
        <div class="file-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14 2 14 8 20 8" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div style="flex:1; min-width:0;">
          <p class="file-name">${file.name}</p>
          <p class="file-meta">SynkDrive file</p>
        </div>
      </div>

      <!-- CTA -->
      <a href="${url}" class="cta-btn">View file in SynkDrive</a>
      <p class="cta-note">This link will only work if you have a SynkDrive account or create one.</p>
    </div>

    <!-- Footer strip -->
    <div class="card-footer">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="footer-note">If you did not expect this email, you can safely ignore it. You will not get access without clicking the link above.</p>
    </div>

  </div>

  <!-- Bottom info -->
  <div class="bottom-info">
    <p>SynkDrive, Inc. · 1800 Owens St, San Francisco, CA 94158</p>
    <p>
      <a href="#">Unsubscribe</a>
      <span class="divider">·</span>
      <a href="#">Privacy policy</a>
    </p>
  </div>

</div>
</body>
</html>`;
};
