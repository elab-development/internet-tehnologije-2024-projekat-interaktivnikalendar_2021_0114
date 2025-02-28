<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\Sprint;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InvitationController extends Controller
{
    public function sendInvitation(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'sprint_id' => 'required|exists:sprints,id',
        ]);

        $token = Str::random(32);

        $invitation = Invitation::create([
            'email' => $request->email,
            'sprint_id' => $request->sprint_id,
            'token' => $token,
        ]);

        // Send email
        Mail::send('emails.invitation', ['token' => $token], function ($message) use ($request) {
            $message->to($request->email);
            $message->subject('You are invited to join a sprint');
        });

        return response()->json(['message' => 'Invitation sent successfully.']);
    }

    public function acceptInvitation($token)
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();

        $user = User::where('email', $invitation->email)->firstOrFail();

        $sprint = Sprint::find($invitation->sprint_id);
        $sprint->users()->attach($user->id);

        $invitation->delete();

        //return response()->json(['message' => 'Invitation accepted successfully.']);
        return redirect("http://localhost:3000/teams?sprint_id={$sprint->id}&joined=true");    }
}
