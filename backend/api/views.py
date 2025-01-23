# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from transformers import pipeline
from diffusers import StableDiffusionPipeline
import torch

class GenerateContentView(APIView):
    def post(self, request):
        prompt = request.data.get("prompt")
        content_type = request.data.get("content_type")

        if content_type == "text":
            text_generator = pipeline("text-generation", model="gpt2")
            output = text_generator(prompt, max_length=100, num_return_sequences=1)[0]['generated_text']
            return Response({"output": output}, status=status.HTTP_200_OK)

        elif content_type == "image":
            pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1", torch_dtype=torch.float16)
            pipe = pipe.to("cuda")
            image = pipe(prompt).images[0]
            image_path = "generated_image.png"
            image.save(image_path)
            return Response({"image_path": image_path}, status=status.HTTP_200_OK)

        elif content_type == "music":
            # Placeholder for music generation
            music_path = "generated_music.mid"
            return Response({"music_path": music_path}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid content type"}, status=status.HTTP_400_BAD_REQUEST)