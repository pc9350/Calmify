import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic and the user's emotional state. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's emotions.
9. Only generate 10 flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. If given a body of text, extract the most important and relevant information for the flashcards.
12. Make the flashcard answer for the question less than 10 tokens.
13. Adjust the flashcards based on the user's emotional state:
    - Sad: Create funny, uplifting flashcards to improve their mood.
    - Calm: Provide balanced, informative flashcards with a soothing tone.
    - Confused: Simplify concepts and use clear, straightforward language.
    - Surprised: Include interesting facts or unexpected connections in the flashcards.
    - Happy: Maintain the positive mood with lighthearted, engaging content.
    - Disgusted: Use neutral language and focus on objective facts.
    - Angry: Present calming content and focus on positive aspects of the topic.
    - Fear: Provide reassuring information and focus on manageable facts.


Return in the following JSON format:

{
    "flashcards": [{
        "front": str,
        "back": str
    }]
}
`;

export async function POST(req) {
  const openai = OpenAI();
  const data = await req.text();

  const completion = await openai.chat.completion.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });

  const flashcards = JSON.parse(completion.choices[0].message.content);

  return NextResponse.json(flashcards.flashcard);
}
