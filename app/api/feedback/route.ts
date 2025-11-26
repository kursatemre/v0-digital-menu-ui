import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenant_id, customer_name, email, phone, feedback_type, message } = body

    // Validate required fields
    if (!tenant_id || !feedback_type || !message) {
      return NextResponse.json(
        { error: "Tenant ID, feedback type, and message are required" },
        { status: 400 }
      )
    }

    // Validate feedback_type
    if (!['comment', 'suggestion', 'complaint'].includes(feedback_type)) {
      return NextResponse.json(
        { error: "Invalid feedback type" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Insert feedback
    const { data, error } = await supabase
      .from("feedback")
      .insert({
        tenant_id,
        customer_name: customer_name || null,
        email: email || null,
        phone: phone || null,
        feedback_type,
        message,
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting feedback:", error)
      return NextResponse.json(
        { error: "Failed to submit feedback" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error in feedback API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenant_id = searchParams.get("tenant_id")

    if (!tenant_id) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get all feedback for this tenant
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("tenant_id", tenant_id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching feedback:", error)
      return NextResponse.json(
        { error: "Failed to fetch feedback" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in feedback API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: "Feedback ID and status are required" },
        { status: 400 }
      )
    }

    // Validate status
    if (!['new', 'reviewed', 'resolved'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update feedback status
    const { data, error } = await supabase
      .from("feedback")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating feedback:", error)
      return NextResponse.json(
        { error: "Failed to update feedback" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in feedback API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
