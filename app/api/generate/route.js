import {NextResponse} from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export async function POST(req){
    const openai = OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages:[
            {role: "system", content: systemPrompt},
            {role: "user", content: data},
        ],
        model: "gpt-3.5-turbo",
        repsonse_format: {type: 'json_object'},
    })

    const flashcards = JSON.parse(completion)

    return NextResponse.json(flashcards.flashcards)
}