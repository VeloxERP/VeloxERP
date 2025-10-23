#!/usr/bin/env ts-node --esm
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import {User} from "@server/models/User.ts"

async function makeUser(argv: any) {
    const rl = await import('readline/promises')
    const { stdin, stdout } = await import('node:process')
    const reader = rl.createInterface({ input: stdin, output: stdout })

    const username = await reader.question('Username: ')
    const email = await reader.question('Email: ')
    const password = await reader.question('Password: ')
    reader.close()

    const user = await new User({
        username: username,
        email: email,
        password: password,
        firstname: "Max",
        lastname: "Mustermann",
        role: "user"
    })
    console.log(`✅ Created user ${email} (id=${user.id})`)
}

yargs(hideBin(process.argv))
    .scriptName('console')
    .usage('$0 <command> [options]')
    .command(
        'make <resource>',
        'Create a new user interactively',
        y => y.positional('resource', {
            describe: 'which resource to make',
            choices: ['user', 'admin'] as const,
        }),
        argv => {
            switch (argv.resource) {
                case 'user':
                    return makeUser()
            }
        }
    )
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .parse()