'use strict'
const User = use('App/Models/User')
const Promo = use('App/Models/Promo')

class AdminController
{
    async home({ view })
    {
        return view.render('Admin/Home', {
            counters:
            {
                utilisateurs: await User.getCount(),
                promotions: await Promo.getCount()
            }
        })
    }

    async users({ request, view })
    {
        let { page, orderBy, orderDir, search } = request.get()

        let userQuery = User.query()
        if (orderBy === undefined)
            orderBy = "last_name"
        
        if (orderDir !== "DESC" && orderDir !== "ASC")
            orderDir = "ASC"

        userQuery.orderBy(orderBy, orderDir)
        
        if (search !== undefined)
        {
            const likeString = `%${search}%`
            userQuery
                .where("username", "like", likeString)
                .orWhere("email", "like", likeString)
                .orWhere("last_name", "like", likeString)
                .orWhere("first_name", "like", likeString)
        }

        const users = await userQuery.paginate(Math.max(parseInt(page, 10), 1) || 1)
        
        return view.render('Admin/Users/List', {
            users: users.toJSON(),
            search: search,
            orderBy: orderBy,
            orderIcon: orderDir === "DESC" ? "fa:sort-down" : "fa:sort-up",
        })
    }

    async usersImport({ request,  view })
    {
        const promos = await Promo.query().orderBy('name').fetch()
        
        if (request.method() === 'GET')
            return view.render('Admin/Users/Import', { promos: promos.toJSON() })

        let errors = {}
        let success = {}
        const data = request.all()
        for (let mail of data.mails.toLowerCase().split('\n'))
        {
            mail = mail.trim()
            if (!/^.+\..+@etu\.esisar\.grenoble-inp\.fr$/g.test(mail))
            {
                errors[mail] = "Format Invalide"
                continue
            }

            let user = await User.createFromEtuMail(mail)
            user.promo = data.promo

            try
            {
                await user.save()
                success[mail] = `${user.first_name} ${user.last_name} (${user.username})`
            }
            catch(err)
            {
                if (err.code === 'ER_DUP_ENTRY')
                {
                    errors[mail] = "Mail déjà existant"
                }
                else
                {
                    errors[mail] = "Erreur d'insertion"
                }
            }
        }
            
        return view.render('Admin/Users/Import', {
            promos: promos.toJSON(),
            errors: errors,
            success: success
        })
    }
}

module.exports = AdminController
