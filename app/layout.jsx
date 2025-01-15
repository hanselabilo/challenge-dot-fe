import "@styles/globals.css";
import { AuthProvider } from "./Providers";

export const metadata = {
  title: "QuizIn",
  description: "Quiz App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
