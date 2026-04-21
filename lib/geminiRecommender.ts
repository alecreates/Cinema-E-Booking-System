import { GoogleGenerativeAI } from "@google/generative-ai";
import Movie from "@/models/Movie";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getRecommendations(user: any) {
  try {
    // 1. Get movies (limit to avoid huge prompts)
    const movies = await Movie.find({}).lean().limit(50);

    if (!movies.length) return [];

    // 2. Get user's favorite movies
    const favoriteIds = (user.favoriteMovies || []).map((id: any) =>
      id.toString()
    );

    const favoriteMovies = movies.filter((m: any) =>
      favoriteIds.includes(m._id.toString())
    );

    // 3. Build prompt (IMPORTANT: include IDs)
    const prompt = `
You are a movie recommendation system.

The user likes these movies:
${favoriteMovies
  .map(
    (m: any) =>
      `- ${m._id}: ${m.title} | Genres: ${m.genre?.join(", ") || "N/A"}`
  )
  .join("\n")}

Here is the full catalog:
${movies
  .map(
    (m: any) =>
      `- ${m._id}: ${m.title} | Genres: ${m.genre?.join(", ") || "N/A"}`
  )
  .join("\n")}

TASK:
Recommend 5 movies the user has NOT already liked.

IMPORTANT RULES:
- Use ONLY movieId from the catalog
- Do NOT return full movie objects
- Return ONLY valid JSON
- No extra text

FORMAT:
[
  {
    "movieId": "OBJECT_ID_HERE",
    "reason": "short explanation"
  }
]
`;

    // 4. Gemini model (FIXED)
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    // 5. Generate response
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 6. Extract JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Bad Gemini response:", text);
      return [];
    }

    const cleanJson = text.slice(jsonStart, jsonEnd + 1);

    let recommendations;
    try {
      recommendations = JSON.parse(cleanJson);
    } catch (err) {
      console.error("JSON parse failed:", cleanJson);
      return [];
    }

    // 7. Convert movieIds → actual movies
    const enriched = recommendations
      .map((rec: any) => {
        const movie = movies.find(
          (m: any) => m._id.toString() === rec.movieId
        );

        if (!movie) return null;

        return {
          movie,
          reason: rec.reason,
        };
      })
      .filter(Boolean);

    return enriched;
  } catch (err) {
    console.error("Recommendation error:", err);
    return [];
  }
}