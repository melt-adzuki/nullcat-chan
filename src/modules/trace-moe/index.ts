import { z } from "zod"
import Module from "@/module"
import autobind from "autobind-decorator"
import Message from "@/message";
import fetch from "node-fetch";


export default class extends Module {
    public readonly name = "trace-moe";

    private readonly itemSchema = z.object({
        anilist: z.number(),
        filename: z.string(),
        episode: z.number(),
        from: z.number(),
        to: z.number(),
        similarity: z.number(),
        video: z.string().url(),
        image: z.string().url(),
    })
    
    private readonly schema = z.object({
        frameCount: z.number(),
        error: z.string(),
        result: z.array(this.itemSchema),
    })

    @autobind
    public install() {
        return {};
    }

    @autobind
    private async  mentionHook(msg: Message) {
        const filteredImageFiles = msg.files.filter((file) => {
            return file.type.startsWith("image");
        });
        
        if (!filteredImageFiles.length) {
            return false;
        }
        
        const targetImage = filteredImageFiles[0];

        let anilistId: number;
        try {
            const res = await fetch(`https://api.trace.moe/search?url=${encodeURIComponent(
                targetImage.url
              )}`);
              const data = await res.json();
              const result = this.schema.safeParse(data);
      
              if (!result.success) {
                  this.log("Validation failed.")
                  console.warn(result.error);
                  return false;
              }

              const firstData = result.data.result[0];
              anilistId = firstData.anilist
        } catch (error) {
            this.log("Failed to fetch status from Trace Moe");
            console.warn(error);
            return false;            
        }
        




        
    }


}