// Edge function entrypoint using Deno.serve

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { goal } = await req.json()

    if (!goal) {
      throw new Error('Goal is required')
    }

    // Use Anthropic Claude for structured learning path generation
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `You are a mentor. A student will give you a goal. 
Break this goal into 3–5 milestones. 
For each milestone, generate 3–6 concrete step-by-step tasks with clear instructions. 
Tasks should include things like reading specific books or articles, taking online classes, doing exercises, writing reflections, or practicing skills. 
Always include enough detail for the student to know *exactly what to do next*. 
Also suggest 3–5 relevant tools, apps, or resources they can use. 
Return everything in JSON with fields: milestones, tools.

Each milestone should have: id, title, description, order, tasks
Each task should have: id, title, description, completed (always false)
Each tool should have: id, name, category, description, url (optional)

Student's goal: ${goal}`
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.content[0].text

    // Parse the JSON from the LLM response
    let parsedContent
    try {
      // Extract JSON from the response (sometimes LLMs wrap JSON in markdown)
      const jsonMatch = content.match(/```json\n?(.*?)\n?```/s) || content.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
      parsedContent = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      throw new Error('Failed to parse LLM response as JSON')
    }

    // Ensure proper structure and add IDs if missing
    const learningPath = {
      goal,
      milestones: parsedContent.milestones.map((milestone: any, index: number) => ({
        id: milestone.id || `milestone-${index + 1}`,
        title: milestone.title,
        description: milestone.description,
        order: milestone.order || index + 1,
        tasks: milestone.tasks.map((task: any, taskIndex: number) => ({
          id: task.id || `${index + 1}-${taskIndex + 1}`,
          title: task.title,
          description: task.description,
          completed: false
        }))
      })),
      suggestedTools: parsedContent.tools.map((tool: any, index: number) => ({
        id: tool.id || `tool-${index + 1}`,
        name: tool.name,
        category: tool.category || 'General',
        description: tool.description,
        url: tool.url
      }))
    }

    return new Response(
      JSON.stringify(learningPath),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})