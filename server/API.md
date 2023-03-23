# Merck Label Dashboard API Guide

# Samples

## Relevant Types

```json
{
    "id": String,
    "audit_id": String,
    "audit_number": Int,
    "team_name": String,
    "date_created": Date,
    "date_modified": Date,
    "expiration_date": Date,
    "data": JSON
}
```

## `GET` /samples

-   Get all samples grouped by team

## `GET` /samples/?id=

-   Query all samples and find the one with `id`

## `GET` /samples/?team_name=

-   Query all samples and find the ones with `team_name`
-   Team name cannot contain the '=', '&', or '?' characters

## `GET` /samples/?id=&team_name=

-   Query all samples and find the one with `id` and `team_name`
-   Team name cannot contain the '=', '&', or '?' characters

## `GET` /samples/:id/audit

-   Get the audit history of a sample with `id`

## `GET` /deleted_samples

-   Get all deleted samples grouped by team

## `POST` /samples

-   Create a sample
    -   Must provide `team_name` and `data`

## `PATCH` /samples/:id

-   Update a sample with `id`
    -   Must `data`

## `DELETE` /samples/:id

-   Delete a sample with `id`

## `DELETE` /samples

-   Deletes all samples with provided ids
    -   Must provide `ids` in the request body

---

# Teams

## Relevant Types

```json
{
    "name": String,
}
```

## `GET` /teams

-   Get all teams

## `POST` /teams

-   Create a team
    -   Must provide `name`

## `PATCH` /teams/:name

-   Update a team name
    -   Must provide `name`

## `DELETE` /teams/:name

-   Delete a team with `name`

---

# Teams Fields

## Relevant Types

```json
{
    "id": Int,
    "team_name": String,
    "name": String,
    "display_name": String,
}
```

## `GET` /fields

-   Get all fields gruoped by team name

## `GET` /fields/:team

-   Get all fields for a `team`

## `GET` /fields/:team/:id

-   Get a field for a `team` with `id`

## `POST` /fields

-   Create a field
    -   Must provide `team_name`, `name`
    -   Optional `display_name`

## `PATCH` /fields/:id

-   Update a field with `id`
    -   Must provide `name`
    -   Optional `team_name`, `display_name`

## `DELETE` /fields/:id

-   Delete a field with `id`

---

# Teams Labels

## Relevant Types

```json
{
    "id": Int,
    "name": String,
    "team_name": String,
    "width": Int,
    "length": Int,
    "data": JSON
}
```

## `GET` /labels

-   Get all labels grouped by team name

## `GET` /labels/?team=

-   Get all labels for a `team`

## `GET` /labels/?team=?width=?length=

-   Get all labels for a `team`, with a specific `width`, and `length`

## `GET` /labels/:id

-   Get a label with `id`

## `POST` /labels

-   Must provide `team_name`, `width`, `length`, `data`

## `POST` /labels/generate

-   Must provide `sample_id`, `layout_id`


## `DELETE` /labels/:id

-   Delete a label with `id`

## `PATCH` /labels/:id

-   Update a label with `id`
    -   Must provide `team_name`, `width`, `length`, `data`

---

# Printers

## Relevant Types

```json
{
    "ip": String,
    "name": String,
    "location": String,
}
```

## `GET` /printers

-   Get all printers

## `GET` /printers/:ip

-   Get a printer with `ip`

## `POST` /printers

-   Create a printer
    -   Must provide `ip`
    -   Optional `name`, `location`

## `DELETE` /printers/:ip

-   Delete a printer with `ip`

## `PATCH` /printers/:ip

-   Update a printer with `ip`
    -   Optional `ip`, `name`, `location`

---
