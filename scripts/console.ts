#!/usr/bin/env ts-node --esm
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'

async function makeUser(argv: any) {
    console.error('Interactive user creation via CLI is not supported with Better Auth. Please use the web interface or the admin API.')
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