# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/977f9aa4-755a-4147-9867-4e1c40c708c0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/977f9aa4-755a-4147-9867-4e1c40c708c0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Theme Toggle Feature

The application includes a comprehensive theme toggle system with the following features:

- **Light Mode**: Clean, bright interface for daytime use
- **Dark Mode**: Easy on the eyes for low-light environments  
- **System Mode**: Automatically follows your operating system's theme preference

### How to Use

The theme toggle is available in multiple locations throughout the application:

1. **Chat Interface**: Located in the top-right corner of the chat header, next to the settings icon
2. **Sidebar**: Found in the sidebar header next to the Weez AI logo
3. **Dashboard Headers**: Available in all dashboard interfaces (Employee, Admin, etc.)

### Implementation Details

- Uses `next-themes` for robust theme management
- Persists theme preference in localStorage
- Smooth transitions between themes
- Responsive design that works across all screen sizes
- Accessible with proper ARIA labels and keyboard navigation

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/977f9aa4-755a-4147-9867-4e1c40c708c0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
