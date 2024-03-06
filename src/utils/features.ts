import axios from "axios";
import _ from "lodash";
import { generate } from "random-words";


const generateMCQ = ( meaning: {
  Text: string;
}[], idx:number): string[] => {

  const correctAns: string = meaning[idx].Text;
  const allMeaningExceptForCorrect = meaning.filter((i) => i.Text !== correctAns)
  const incorrectOptions: string[] = _.sampleSize(allMeaningExceptForCorrect, 3).map((i) => i.Text);

  const mcqOptions = _.shuffle([...incorrectOptions, correctAns]);
  return mcqOptions;
}

export const translateWords = async(params:LangType): Promise<WordType[]> => {
    try{
        // const words = generate(8).map((word) => ({
        //     Text: word,
        // }));

        const generatedWords = generate(8) as string[];
        const words = generatedWords.map(word => ({
          Text: word,
        }))
        


        const response = await axios.post("https://microsoft-translator-text.p.rapidapi.com/translate", words, {
                params: {
                'to[0]': params,
                'api-version': '3.0',
                profanityAction: 'NoAction',
                textType: 'plain'
              },
              headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '5ac1c3a50dmsh77325e630416e6bp1dae46jsna078da916c37',
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
              },
        })
        
        const receive:FetchedDataType[] = response.data;
        const arr:WordType[] = receive.map((i, idx) => {
          const options:string[] = generateMCQ(words, idx);
          return {
            word: i.translations[0].text,
            meaning: words[idx].Text,
            options
          }
        })

        return arr;
    } 
    catch(error){
        console.log(error);
        throw new Error("Some Error");
    }
};


export const countMatchingElements = (arr1:string[], arr2:string[]):number => {
  if(arr1.length !== arr2.length) throw new Error("Arrays are not equal");

  let matchedCount = 0;

  for(let i = 0; i < arr1.length; i++){
    if(arr1[i] === arr2[i]) matchedCount++;
  }

  return matchedCount;
};


export const fetchAudio = async(text:string, language:LangType): Promise<string> => {

  const key = import.meta.env.VITE_TEXT_TO_SPEECH_API;
  const rapidKey = import.meta.env.VITE_RAPID_API;

const encodedParams = new URLSearchParams({
  src: text,
  r: "0",
  c: "mp3",
  f: "8khz_8bit_mono",
  b64: "true",
});

if(language === "ja") encodedParams.set("hl", "ja-jp")
if(language === "es") encodedParams.set("hl", "es-es")
if(language === "fr") encodedParams.set("hl", "fr-fr")
else encodedParams.set("hl", "hi-in")

const {data}: {data:string} = await axios.post("https://voicerss-text-to-speech.p.rapidapi.com/", encodedParams, {
  params: {key: key},
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': rapidKey,
    'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
  },
})

  return data;
}