import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Entre com sua pergunta",
      }
    });
    return;
  }

  try {

    const GPT35TurboMessage = [
      { role: "system", content: `Você é um professor.
      Entender o que é o desenvolvimento sustentável e a sua importância;
      Conhecer as três dimensões essenciais da sustentabilidade;
      Reconhecer as consequências do crescimento populacional;
      Identificar a relevância dos ecossistemas e o impacto do homem;
      Entender a importância da energia para a sustentabilidade;
      Reconhecer os desafios da água e da produção de alimentos;
      Compreender a importância das políticas ambientais.` }
    ];
    let input = appendMessages(GPT35TurboMessage,animal);
    console.log(input);
    
    const completion = await openai.createChatCompletion({
//      model: "text-davinci-003",
      model: "gpt-3.5-turbo",

      messages: input
    });
    res.status(200).json({ result: completion.data.choices[0].message.content });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function appendMessages(messages, prompt) {
   messages.push({ role: "user", content: prompt});
   return messages;
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
