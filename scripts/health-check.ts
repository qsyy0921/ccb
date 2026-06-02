#!/usr/bin/env bun

import { spawnSync } from 'node:child_process'

type Step = {
  name: string
  command: string
  args: string[]
}

const steps: Step[] = [
  {
    name: 'Build production bundle',
    command: 'bun',
    args: ['run', 'build'],
  },
  {
    name: 'Check bundle integrity',
    command: 'bun',
    args: ['run', 'scripts/check-bundle-integrity.ts'],
  },
  {
    name: 'Smoke test Bun CLI',
    command: 'bun',
    args: ['dist/cli-bun.js', '--version'],
  },
  {
    name: 'Smoke test Node CLI',
    command: 'node',
    args: ['dist/cli-node.js', '--version'],
  },
]

for (const step of steps) {
  console.log(`\n==> ${step.name}`)
  const result = spawnSync(step.command, step.args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
  })

  if (result.error) {
    console.error(`Failed to start ${step.command}: ${result.error.message}`)
    process.exit(1)
  }

  if (result.status !== 0) {
    console.error(`${step.name} failed with exit code ${result.status}`)
    process.exit(result.status ?? 1)
  }
}

console.log('\nHealth check passed.')
