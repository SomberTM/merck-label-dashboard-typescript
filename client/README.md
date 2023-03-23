# Merck Label Dashboard Client Developers Guide

This is a guide for developers who want to contribute to the Merck Label Dashboard client.

## Misc

Through out the code you will notice the use of Luxon. Luxon is a library that provides a wrapper around the native Date object. It provides a more robust API for dealing with dates and times. It also provides a more robust API for dealing with time zones. Luxon is a drop in replacement for the native Date object. You can read more about Luxon [here](https://moment.github.io/luxon/).
Its main use case is being able to convert from the dates that prisma likes (ISO) and the dates that material ui likes (yyyy-MM-dd)

## Familiarizing yourself with the project

-   ### State Management

-   ### Components

# Todo

-   [x] Deleting samples is buggin
    -   Make api endpoint to delete multiple samples
-   [x] Add a way to view deleted samples as well as the audit trail of a sample
-   [x] Load current label design based on current label size and the current team.
-   [x] Add back label generation and make sure the label api is working properly
    -   [ ] WHen you generate labels have a popup panel that shows the labels that are being generated
            where you can pick from all the sizes of labels that team has as well as the number of labels.
            And pick your printer
-   [x] Highlight expired samples
