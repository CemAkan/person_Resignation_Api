BASE_URL: http://143.110.166.213:2000

SIGN UP
method: POST
endPoint: /users/sign-up
parameters: {username [between 1 and 10 characters], email [format: email], password [between 8 and 20 characters]}

SIGN IN
method: GET
endPoint: /users/sign-in
parameters: {username [between 1 and 10 characters], password [between 8 and 20 characters]}

EDIT PROFILE
method: PUT
endPoint: /users/update-profile/:{userId}
parameters: {username [between 1 and 10 characters ], email [format: email], password
[between 8 and 20 characters] }

DELETE USER
method: DELETE
endPoint: /users/delete-profile/:{userId}

LIST ALL USERS
method:GET
endPoint: /users/list

