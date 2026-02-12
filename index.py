from workers import Response
async def on_fetch(request):
    return Response("Hello, World!")