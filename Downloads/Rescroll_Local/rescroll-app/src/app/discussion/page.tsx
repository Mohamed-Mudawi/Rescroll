'use client';

export default function DiscussionPage() {
    return (
        <main className="flex flex-col items-center justify-start min-h-screen pt-24 px-4 bg-white">
            <h1 className="text-4xl font-bold mb-4 text-center">Discussion Forum</h1>
            <p className="text-lg text-gray-700 max-w-2xl text-center mb-6">
                Welcome to the Rescroll discussion forum. Ask questions, share tips, and engage with other users about resumes, interviews, and career advice.
            </p>
            <div className="w-full max-w-3xl border border-gray-200 rounded-lg p-6 bg-gray-50">
                <p className="text-gray-500 text-center">
                    Discussions will appear here soon. Stay tuned!
                </p>
            </div>
        </main>
    );
}