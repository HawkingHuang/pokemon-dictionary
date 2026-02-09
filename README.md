# Pokémon Dictionary

An experimental Pokémon introductory guide built with Nuxt 3. Explore game versions, browse Pokédex entries by game, and compare Pokémon stats side-by-side.

## Features

- **Home**: overview of what the app does with embedded media.
- **Game Versions**: carousel of main-series versions with modal details (generation, Pokédexes, regions).
- **Pokédex by Version**: choose a Pokédex and browse all Pokémon in that version.
- **Pokémon Details**: view stats, moves (by version), and encounter locations.
- **Stat Comparison**: compare two Pokémon with a quick difference summary.

## Pages

- `/` Home
- `/version` Game versions browser
- `/pokedex` Pokédex selector and list
- `/pokedex/[name]` Pokémon detail page
- `/pokemon` Pokémon search and comparison

## Tech Stack

- Nuxt 3 + Vue 3
- @nuxt/ui components
- Tailwind CSS (utility styling)
- jQuery (client-side data fetching)
- PokeAPI as the data source

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the dev server at http://localhost:3000:

```bash
npm run dev
```

## Build & Preview

```bash
npm run build
npm run preview
```

## Data Source

This project uses the public [PokeAPI](https://pokeapi.co/) for Pokémon, versions, moves, and encounter data.
