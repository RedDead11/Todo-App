# Taskify - Modern Todo App with Authentication

<p align="center">
  <a href="https://todo-app-rosy-three-39.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Launch_App-00C853?style=for-the-badge&logoColor=white" alt="Launch App"/>
  </a>
</p>

A full-stack todo application built with React, TypeScript, and Supabase. Features user authentication, real-time data persistence, and a clean, animated UI.

 ![Taskify Demo](./src/Images/screenshot.png)

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with Supabase Auth
- 💾 **Persistent Storage** - Cloud database with PostgreSQL
- ✏️ **Full CRUD Operations** - Create, read, update, and delete todos
- 🎨 **Smooth Animations** - Polished entrance and exit animations
- 🔒 **Private Todos** - Each user sees only their own tasks
- ⚡ **Real-time Updates** - Changes sync instantly with the database
- 📱 **Responsive Design** - Works on desktop and mobile

## 🚀 Tech Stack

- **Frontend:** React 18, TypeScript
- **Backend:** Supabase (PostgreSQL + Auth)
- **Styling:** CSS3 with custom animations
- **State Management:** React Hooks
- **Routing:** React Router v6

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account ([supabase.com](https://supabase.com))

## 🛠️ Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/taskify.git
   cd taskify
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**
   
   Run this SQL in your Supabase SQL Editor:
```sql
   CREATE TABLE todos (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     todo TEXT NOT NULL,
     is_done BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

   -- Policies
   CREATE POLICY "Users can view own todos" ON todos
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own todos" ON todos
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own todos" ON todos
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own todos" ON todos
     FOR DELETE USING (auth.uid() = user_id);
```

5. **Start the development server**
```bash
   npm start
```

   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📖 Usage

1. **Sign Up** - Create a new account with email and password
2. **Add Todos** - Type a task and press Enter or click the + button
3. **Edit** - Click the pencil icon to edit any todo
4. **Complete** - Click the checkmark to mark todos as done
5. **Delete** - Click the trash icon to remove todos
6. **Logout** - Click the logout button to sign out

## 🏗️ Project Structure
```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.tsx          # Login page
│   │   ├── Signup.tsx         # Signup page
│   │   └── Auth.css           # Auth styling
│   ├── InputField.tsx         # Todo input component
│   ├── TodoList.tsx           # Todo list container
│   ├── SingleTodo.tsx         # Individual todo card
│   ├── ProtectedRoute.tsx     # Route guard
│   └── styles.css             # Component styles
├── hooks/
│   └── useAuth.ts             # Authentication hook
├── lib/
│   └── supabase.ts            # Supabase client config
├── model.ts                   # TypeScript interfaces
├── App.tsx                    # Main app component
└── App.css                    # Global styles
```

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
