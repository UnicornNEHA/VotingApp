OverView:-<br />

Welcome to the Voting App, a full-stack application built using MongoDB, Express, and Node.js. This application enables users to participate in elections by casting their votes in real-time.

Features:-<br />

1.User Registration and Login: Secure user authentication to ensure only registered voters can participate.<br />
2.Candidate Management: Add, update, and manage candidate profiles.<br />
3.Live Voting: Real-time vote tracking and display of results as they come in.<br />
4.Admin cannot vote.<br />

API Endpoints:-<br />

Authentication:-<br />

1.Sign Up<br />
POST /signup: Sign up a user<br />

2.Login<br />
POST /login: Login a user<br />

Candidates:-<br />

1.Get Candidates<br />
GET /candidates: Get the list of candidates<br />

2.Add Candidate<br />
POST /candidates: Add a new candidate (Admin only)<br />

3.Update Candidate<br />
PUT /candidates/:id: Update a candidate by ID (Admin only)<br />

4.Delete Candidate<br />
DELETE /candidates/:id: Delete a candidate by ID (Admin only)<br />

Voting:-<br />

1.Get Vote Count<br />
GET /candidates/vote/count: Get the count of votes for each candidate<br />

2.Vote for Candidate<br />
POST /candidates/vote/:id: Vote for a candidate (User only)<br />

User Profile:-<br />

1.Get Profile<br />
GET /users/profile: Get user profile information<br />

2.Change Password<br />
PUT /users/profile/password: Change user password<br />
