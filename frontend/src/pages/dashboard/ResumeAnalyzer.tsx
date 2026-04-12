import { useState } from "react";

export default function ResumeAnalyzer() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);

    try {
      // ✅ FIXED (NO localhost)
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Backend error ❌");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      alert("Upload failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          🚀 Resume Analyzer
        </h1>
        <p className="text-gray-400 mt-2">
          Upload your resume and get instant ATS score + improvements
        </p>
      </div>

      {/* UPLOAD */}
      <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 shadow-lg">

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-500 rounded-xl p-6 cursor-pointer hover:bg-green-500/10 transition">
          <span className="text-green-400 text-lg font-semibold">
            📂 Upload Resume
          </span>
          <span className="text-gray-400 text-sm mt-1">
            PDF / DOC supported
          </span>

          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        {fileName && (
          <p className="mt-3 text-sm text-gray-400 text-center">
            Selected: {fileName}
          </p>
        )}

        {loading && (
          <div className="mt-4 text-center">
            <p className="text-green-400 animate-pulse">
              🔍 Analyzing your resume...
            </p>
          </div>
        )}
      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-10 grid md:grid-cols-2 gap-6">

          {/* SCORE */}
          <div className="bg-gradient-to-br from-green-900/40 to-black border border-green-500/30 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-green-400">ATS Score</h2>

            <div className="w-full bg-gray-800 h-4 mt-4 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-4"
                style={{ width: `${result.score || 0}%` }}
              />
            </div>

            <p className="mt-3 text-2xl font-bold">
              {result.score}/100
            </p>
          </div>

          {/* STRENGTHS */}
          <div className="bg-gray-900 border border-green-500/20 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-green-400 mb-3">
              ✔ Strengths
            </h2>

            {result.strengths?.map((s: any, i: number) => (
              <div key={i} className="mb-2 p-2 bg-green-500/10 rounded">
                {s}
              </div>
            ))}
          </div>

          {/* MISSING */}
          <div className="bg-gray-900 border border-red-500/20 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-red-400 mb-3">
              ⚠ Missing Skills
            </h2>

            {result.missingSkills?.map((m: any, i: number) => (
              <div key={i} className="mb-2 p-2 bg-red-500/10 rounded">
                {m}
              </div>
            ))}
          </div>

          {/* IMPROVEMENTS */}
          <div className="bg-gray-900 border border-yellow-500/20 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-yellow-400 mb-3">
              💡 Improvements
            </h2>

            {result.improvements?.map((imp: any, i: number) => (
              <div key={i} className="mb-2 p-2 bg-yellow-500/10 rounded">
                {imp}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}