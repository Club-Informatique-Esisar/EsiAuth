"use strict"
const User = use("App/Models/User")
const Token = use("App/Models/Token")

const Route = use('Route')
const Mail = use('Mail')
const moment = require("moment")

class AuthController
{
    async login ({ request, response, auth, session })
    {
        const { login, password } = request.all()
        try
        {
            await auth.attempt(login, password)
        }
        catch(err)
        {
            session
                .withErrors([{ field: "password", message: "Le login ou le mot de passe est incorrect" }])
                .flashExcept(["password", "csrf_token"])
        }

        return response.redirect("back")
    }

    async signIn ({ request, response, auth, view, session })
    {
        /*const { username, email, password, password2 } = request.all()
        if (password !== password2)
        {
            session
                .withErrors([{ field: "password2", message: "Doit-être égal au premier" }])
                .flashExcept(["password", "password2", "csrf_token"])
            return response.redirect("back")
        }

        const user = new User()
        try
        {
            user.username = username
            user.email = email
            user.password = password
            await user.save()
        }
        catch(err)
        {
            return view.render("Guests/LoginOrRegister", { error: "Erreur lors de la création de l'utilisateur" })
        }

        await auth.login(user)
        return response.redirect("back")*/

        session.flash({ notification: { type: "error", text: "L'inscription des externes n'est pas disponible pour le moment." } })
        return response.redirect("back")
    }
    
    async forgotPassword ({ request, response, view, session })
    {
        if (request.method() === "GET")
            return view.render("Guests/ForgotPassword")

        const tokenType = "reset_password"

        const { email } = request.all()
        if (!/.+@.+\..+/.test(email))
        {
            session
                .withErrors([{ field: "email", message: "L'email saisi est invalide" }])
                .flashExcept(["csrf_token"])
            return response.redirect("back")
        }

        const user = await User
            .query()
            .where("email", email)
            .first()

        if (user !== null)
        {
            await user.tokens().where("type", tokenType).delete()

            const token = require("uuid").v4()
            await user.tokens().create({
                token: token,
                type: tokenType,
                expire_at: moment().add(10, "m").toDate()
            })

            const resetUrl = `${process.env.CLIENT_URL}${Route.url("AuthController.resetPassword")}?token=${token}`
            await Mail.raw(
                `Lien pour réinitialiser votre mot de passe : ${resetUrl}\nCe lien expirera dans 10 minutes.`,
                (message) => {
                    message.from("no-reply@esisariens.org")
                    message.to(user.email)
                    message.subject("Esisariens - Réinitialisation de mot de passe")
                })
        }
            
        session.flash({
            notification: {
                type: "success",
                text: "Si un compte est associé à cet email, un lien pour réinitialiser le mot de passe y a été envoyé."
            }
        })
        return response.redirect("/")
    }

    async resetPassword ({ request, response, view, session })
    {
        const tokenType = "reset_password"

        // Verification du token
        const { token } = request.get()
        if (token === undefined)
        {
            session.flash({ notification: { type: "error", text: "Le lien de réinitialisation est incorrect." } })
            return response.redirect("/")
        }

        const user = await User
            .query()
            .whereHas("tokens", (builder) => {
                builder.where("type", tokenType)
                builder.where("token", token)
                builder.where("expire_at", ">", new Date())
            })
            .first()

        if (user === null)
        {
            await Token.query().where("token", token).delete()
            session.flash({ notification: { type: "error", text: "Le token de réinitialisation fourni n'existe pas ou n'est plus valide." } })
            return response.redirect("/")
        }

        if (request.method() === "GET")
            return view.render("Guests/ResetPassword")

        const { password, password2 } = request.post()
        if (password !== password2)
        {
            session
                .withErrors([{ field: "password2", message: "Les deux mots de passe doivent être égaux !" }])
                .flashExcept(["password", "password2", "csrf_token"])
            return response.redirect("back")
        }

        try
        {
            await user.tokens().where("type", tokenType).delete()
            user.password = password
            await user.save()
        }
        catch(err)
        {
            console.error(err)
            session.flash({ notification: { type: "error", text: "Une erreur s'est produite lors de l'opération, merci de réessayer." } })
            return response.redirect("/")
        }

        session.flash({ notification: { type: "success", text: "Mot de passe réinitialisé avec succès !" } })
        return response.redirect("/")
    }

    async logout({ response, auth })
    {
        await auth.logout()
        return response.redirect("/")
    }

    async listToken({ auth })
    {
        return await auth.authenticator("api").listTokensForUser(auth.current.user)
    }

    async createToken({ auth })
    {
        return await auth.authenticator("api").generate(auth.current.user)
    }
}

module.exports = AuthController
