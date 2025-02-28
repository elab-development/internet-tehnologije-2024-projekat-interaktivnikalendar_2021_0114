<!DOCTYPE html>
<html>
<head>
    <title>Invitation to join Team</title>
</head>
<body>
    <h1>You are invited to join a team</h1>
    <p>Click the link below to accept the invitation:</p>
    <a href="{{ url('/api/invitations/accept/' . $token) }}">Accept Invitation</a>
</body>
</html>