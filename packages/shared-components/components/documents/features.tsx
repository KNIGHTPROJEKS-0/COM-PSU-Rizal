import { FileText, Search, Edit, Clock, Cloud } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
      title: "Summarize Documents",
      description: "Automatically extract key points from long documents to save time and improve comprehension.",
    },
    {
      icon: <Search className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
      title: "Search & Retrieve",
      description: "Quickly find important details across all your documents with AI-powered search.",
    },
    {
      icon: <Edit className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
      title: "Review & Suggest Edits",
      description: "Get AI-powered suggestions to improve clarity and structure in your documents.",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
      title: "Automate Updates",
      description: "Track version history and set reminders for document reviews and updates.",
    },
    {
      icon: <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-500" />,
      title: "Cloud Integration",
      description: "Seamlessly connect with Google Drive, Apple Files, Dropbox, and OneDrive.",
    },
  ]

  return (
    <section className="mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Powerful AI Features</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          DocumentsAI helps you manage, analyze, and extract insights from all your documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-full w-fit">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
