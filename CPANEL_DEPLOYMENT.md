# cPanel Deployment Guide - mrp_frontend

This guide outlines the steps to deploy the `mrp_frontend` application to a cPanel-based server using the optimized `mrp_frontend_cpanel_deploy.zip` package.

## Prerequisites
- cPanel access with "Setup Node.js App" feature.
- Node.js version 20.x or higher installed on the server.

## Step-by-Step Deployment

### 1. Create Node.js Application in cPanel
1. Log in to your **cPanel**.
2. Search for and open **"Setup Node.js App"**.
3. Click **"Create Application"**.
4. Configure the following:
   - **Node.js version**: 20.x or higher
   - **Application mode**: `production`
   - **Application root**: Enter the path where you will upload the files (e.g., `mrp_frontend`).
   - **Application URL**: Select your domain and enter the desired path (or leave empty for the main domain).
   - **Application startup file**: `server.js`
5. Click **"Create"**. Note the application path provided after creation.

### 2. Upload and Extract Files
1. Go to **"File Manager"** in cPanel.
2. Navigate to the **Application root** folder you created in Step 1.
3. Upload the `mrp_frontend_cpanel_deploy.zip` file.
4. **Right-click** the uploaded file and select **"Extract"**.
5. Once extracted, you should see the `server.js` file, `mrp_frontend` folder, `public` folder, and `node_modules` folder in the root.

### 3. Finalize and Start
1. Go back to the **"Setup Node.js App"** page.
2. Find your application and click the **"Edit"** (pencil) icon.
3. (Optional) If you see an `npm install` button, you can click it to ensure dependencies are correctly linked, though the zip already includes them.
4. Click **"Restart"** at the top of the application setup page.
5. Visit your Application URL to verify the deployment.

## Troubleshooting
- **404 Errors on Static Files**: Ensure the `public` and `mrp_frontend/.next/static` folders were correctly extracted into the application root.
- **Port Conflicts**: cPanel's Passenger module handles the port automatically; do not specify a port in `server.js`.
- **Environment Variables**: The `.env` file is included in the zip and contains the production settings. You can also edit it directly in the File Manager.
