import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Build the prompt for Claude
function buildPrompt(movie, ratings) {
  // Identify what the user loved (4-5 stars) and didn't love (1-2 stars)
  const loved = [];
  const disliked = [];

  if (ratings.plot >= 4) loved.push("plot/story");
  else if (ratings.plot && ratings.plot <= 2) disliked.push("plot/story");

  if (ratings.acting >= 4) loved.push("acting performances");
  else if (ratings.acting && ratings.acting <= 2) disliked.push("acting");

  if (ratings.cinematography >= 4) loved.push("cinematography/visuals");
  else if (ratings.cinematography && ratings.cinematography <= 2) disliked.push("cinematography");

  if (ratings.score >= 4) loved.push("music/score");
  else if (ratings.score && ratings.score <= 2) disliked.push("music/score");

  const lovedText = loved.length > 0
    ? `The user particularly loved: ${loved.join(", ")}.`
    : "";
  const dislikedText = disliked.length > 0
    ? `The user was less impressed by: ${disliked.join(", ")}.`
    : "";

  return `You are a movie recommendation expert. Based on the user's detailed rating of a movie, suggest 3-5 movies they would enjoy.

The user watched "${movie.title}" (${movie.year || "unknown year"}) and rated it:
- Overall: ${ratings.overall}/5 stars
${ratings.plot ? `- Plot: ${ratings.plot}/5 stars` : ""}
${ratings.acting ? `- Acting: ${ratings.acting}/5 stars` : ""}
${ratings.cinematography ? `- Cinematography: ${ratings.cinematography}/5 stars` : ""}
${ratings.score ? `- Music/Score: ${ratings.score}/5 stars` : ""}

${lovedText}
${dislikedText}

Movie details:
- Genres: ${movie.genres?.map((g) => g.name).join(", ") || "Unknown"}
- Overview: ${movie.overview || "No overview available"}

Recommend 3-5 movies that:
1. Match what the user loved about this movie
2. Avoid weaknesses in areas they rated poorly
3. Are similar in genre/tone but not too obvious

In your reasoning, specifically reference which aspects (plot, acting, cinematography, score) make each recommendation a good fit.

IMPORTANT: Respond with ONLY valid JSON in this exact format, no other text:
[
  {
    "title": "Movie Title",
    "year": 2020,
    "reason": "2-3 sentences explaining why this movie matches their taste, referencing specific aspects they rated highly."
  }
]`;
}

export async function POST(request) {
  try {
    const { movie, ratings } = await request.json();

    // Validate input
    if (!movie || !ratings) {
      return Response.json(
        { error: "Movie and ratings are required" },
        { status: 400 }
      );
    }

    // Call Claude API
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: buildPrompt(movie, ratings) }],
    });

    // Parse Claude's response
    const responseText = message.content[0].text;
    const recommendations = JSON.parse(responseText);

    return Response.json({ recommendations });
  } catch (error) {
    console.error("Recommendation error:", error);
    return Response.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
