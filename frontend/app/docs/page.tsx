import React from 'react';
import Link from 'next/link';

const DocsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">API Documentation</h1>
          <p className="text-lg text-slate-300 mb-8">
            Welcome to the documentation for the Full Stack Todo Application API.
          </p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Backend API Documentation</h2>
          <p className="text-slate-300 mb-4">
            The backend API documentation is available at the following endpoints:
          </p>
          <ul className="list-disc pl-6 text-slate-300 space-y-2">
            <li>
              <a
                href="http://127.0.0.1:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Interactive API Documentation (Swagger UI) - http://127.0.0.1:8000/docs
              </a>
            </li>
            <li>
              <a
                href="http://127.0.0.1:8000/redoc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Alternative API Documentation (ReDoc) - http://127.0.0.1:8000/redoc
              </a>
            </li>
          </ul>
          <p className="text-slate-400 mt-4">
            Note: Make sure the backend server is running on port 8000 for API documentation access.
          </p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Frontend Documentation</h2>
          <div className="prose max-w-none text-slate-300">
            <h3 className="text-lg font-medium text-slate-100">Getting Started</h3>
            <p>
              This is a full-stack todo application built with Next.js for the frontend and FastAPI for the backend.
            </p>

            <h3 className="text-lg font-medium text-slate-100 mt-4">Available Pages</h3>
            <ul className="list-disc pl-6">
              <li>Home Page - <code className="bg-slate-700 px-1 rounded text-slate-200">/</code></li>
              <li>Authentication - <code className="bg-slate-700 px-1 rounded text-slate-200">/auth</code></li>
              <li>Dashboard - <code className="bg-slate-700 px-1 rounded text-slate-200">/dashboard</code></li>
              <li>Tasks - <code className="bg-slate-700 px-1 rounded text-slate-200">/tasks</code></li>
              <li>Documentation - <code className="bg-slate-700 px-1 rounded text-slate-200">/docs</code> (this page)</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-100 mt-4">API Endpoints</h3>
            <p>The application provides the following API endpoints:</p>
            <ul className="list-disc pl-6">
              <li>Authentication: <code className="bg-slate-700 px-1 rounded text-slate-200">POST /api/auth/login</code>, <code className="bg-slate-700 px-1 rounded text-slate-200">POST /api/auth/register</code></li>
              <li>Tasks: <code className="bg-slate-700 px-1 rounded text-slate-200">GET /api/tasks</code>, <code className="bg-slate-700 px-1 rounded text-slate-200">POST /api/tasks</code>, <code className="bg-slate-700 px-1 rounded text-slate-200">PUT /api/tasks/{`{id}`}</code>, <code className="bg-slate-700 px-1 rounded text-slate-200">DELETE /api/tasks/{`{id}`}</code></li>
              <li>OAuth: <code className="bg-slate-700 px-1 rounded text-slate-200">/api/auth/oauth</code></li>
            </ul>

            <h3 className="text-lg font-medium text-slate-100 mt-4">Authentication Guide</h3>
            <p className="mb-2">Most API endpoints require authentication. Here's how to authenticate:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Register a new account:</strong> Send a POST request to <code className="bg-slate-700 px-1 rounded text-slate-200">/api/auth/register</code> with email and password</li>
              <li><strong>Login:</strong> Send a POST request to <code className="bg-slate-700 px-1 rounded text-slate-200">/api/auth/login</code> with your credentials to get an access token</li>
              <li><strong>Access protected endpoints:</strong> Include the token in the Authorization header as: <code className="bg-slate-700 px-1 rounded text-slate-200">Authorization: Bearer &lt;your_token&gt;</code></li>
            </ol>

            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <h4 className="font-medium text-cyan-400">Quick Start:</h4>
              <p className="mt-2">To use the application without unauthorized errors:</p>
              <ol className="list-decimal pl-5 mt-1 space-y-1">
                <li>Navigate to the <Link href="/auth" className="text-cyan-400 hover:text-cyan-300 hover:underline">authentication page</Link> in the frontend</li>
                <li>Create a new account or log in with existing credentials</li>
                <li>The application will automatically handle token storage and inclusion for API requests</li>
              </ol>
            </div>

            <p className="mt-2 text-red-400 font-medium">Note: Unauthorized errors occur when accessing protected endpoints without a valid token.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;