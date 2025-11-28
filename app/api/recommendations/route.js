import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Build the prompt for Claude
function buildPrompt(movie, ratings, focusText = "") {
  // Figure out what the user loved (4-5 stars) and disliked (1-2 stars)
  const loved = [];
  const disliked = [];

  if (ratings.plot >= 4) loved.push("plot/story");
  if (ratings.plot && ratings.plot <= 2) disliked.push("plot/story");

  if (ratings.acting >= 4) loved.push("acting");
  if (ratings.acting && ratings.acting <= 2) disliked.push("acting");

  if (ratings.cinematography >= 4) loved.push("cinematography");
  if (ratings.cinematography && ratings.cinematography <= 2) disliked.push("cinematography");

  if (ratings.score >= 4) loved.push("music/score");
  if (ratings.score && ratings.score <= 2) disliked.push("music/score");

  // Build the prompt
  let prompt = `You are a movie recommendation expert.

The user watched "${movie.title}" (${movie.year || "unknown year"}) and rated it ${ratings.overall}/5 stars.
Genres: ${movie.genres?.map((g) => g.name).join(", ") || "Unknown"}
`;

  if (loved.length > 0) {
    prompt += `\nThey particularly loved: ${loved.join(", ")}.`;
  }
  if (disliked.length > 0) {
    prompt += `\nThey were less impressed by: ${disliked.join(", ")}.`;
  }
  if (focusText.trim()) {
    prompt += `\nThey specifically want movies with: "${focusText.trim()}".`;
  }

  prompt += `

Recommend 3-5 movies that match what they loved and avoid what they disliked.

IMPORTANT: Respond with ONLY valid JSON in this exact format:
[{"title": "Movie Title", "year": 2020, "reason": "Why this matches their taste."}]`;

  return prompt;
}

export async function POST(request) {
  try {
    const { movie, ratings, focusText } = await request.json();

    // Validate input
    if (!movie || !ratings) {
      console.error("[AI] Missing movie or ratings in request");
      return Response.json(
        { error: "Movie and ratings are required" },
        { status: 400 }
      );
    }

    console.log("[AI] Getting recommendations for:", movie.title);

    // Call Claude API
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: buildPrompt(movie, ratings, focusText) }],
    });

    // Parse Claude's response
    const responseText = message.content[0].text;

    // Try to parse JSON - Claude might not always return valid JSON
    let recommendations;
    try {
      recommendations = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[AI] Failed to parse Claude response as JSON:", responseText);
      return Response.json(
        { error: "Failed to parse recommendations" },
        { status: 500 }
      );
    }

    console.log("[AI] Successfully got", recommendations.length, "recommendations");
    return Response.json({ recommendations });
  } catch (error) {
    console.error("[AI] Recommendation error:", error.message);
    return Response.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
