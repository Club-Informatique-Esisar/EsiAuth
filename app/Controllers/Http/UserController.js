"use strict"
const User = use("App/Models/User")

class UserController
{
    async profile({ request, response, session, view, auth })
    {
        if (request.method() === "GET")
            return view.render("Users/Profile", { user: auth.user.toJSON() })
        
        const flashExceptFields = ["current_password", "password", "password2", "csrf_token"]

        const {
            email,
            current_password,
            password,
            password2,
            first_name,
            last_name
        } = request.post()
        const user = auth.user

        // If tried to changed mail or password, check if password is correct
        if (user.email !== email || password !== "")
        {
            try
            {
                await auth.validate(user.username, current_password)
            }
            catch(err)
            {
                session
                    .withErrors([{ field: "current_password", message: "Mot de passe incorrect" }])
                    .flashExcept(flashExceptFields)
                return response.redirect("back")
            }
        }

        // Try to change mail if needed
        if (user.email !== email)
        {
            if (!/.+@.+\..+/.test(email))
            {
                session
                    .withErrors([{ field: "email", message: "L'email saisi est invalide" }])
                    .flashExcept(flashExceptFields)
                return response.redirect("back")
            }

            user.email = email
        }

        // Try to change password if needed
        if (password !== "")
        {
            if (password !== password2)
            {
                session
                    .withErrors([{ field: "password2", message: "Les mots de passe doivent être identiques" }])
                    .flashExcept(flashExceptFields)
                return response.redirect("back")
            }

            user.password = password
        }

        // Set other fields
        // Not sure we want to do that this way for the name though
        // user.first_name = first_name
        // user.last_name = last_name

        await user.save()
        return response.redirect("back")
    }
}

module.exports = UserController
