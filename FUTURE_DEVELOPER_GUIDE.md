# Merck Label Dashboard Developer Guide

In this developer guide I will be spilling a few of the dirty secrets and tricks used in this project as well as describe the core pieces of the client and the server. It's intended to help developers new to this project understand how and why things work the way they do.

> Please see [this section](#points-of-improvement)

## Table of Contents

-   ### [Client](#client)

    -   [Redux](#redux)
    -   [Components](#components)
    -   [API Wrapper](#api-wrapper)
    -   [Annoyances](#annoyances)

-   ### [Server](#server)

    -   [Database Information](#database)
    -   [Database Design](#database-design-requirements)
        -   [The Schema](#the-schema)
    -   [API](#api)
    -   [Rasterizing Images](#rasterizing-images)
    -   [Environment Variables](#environment-variables)

-   ### [Improvement / Future Goals](#points-of-improvement)

## Client

### **Redux**

### **Components**

### **API Wrapper**

### **Annoyances**

## Server

### **Database**

We support any database of your choice as long as `Prisma` supports it. Chaniging the provider will most likely cause errors in the schema that you will have to resolve so keep that in mind. By default we use `postgresql` as our database provider. I recommend taking a look at [prisma datasources](https://www.prisma.io/docs/concepts/components/prisma-schema/data-sources) and [prisma database connectors](https://www.prisma.io/docs/concepts/database-connectors).

#### **Database Design Requirements**

Due to Merck specifications we are not allowed to delete or modify any samples from the `samples` table. There are two areas where this causes issues, editing an deleting samples. Without editing or deleting it becomes a challenge to keep track of which samples are still active and which samples is the most recent version of itself.

##### **How we "Edit" Samples**

##### **How we "Delete" Samples**

To simulate the deletion process we have two tables, `samples`, and `deleted_samples`. `samples` stores every single sample, whether its been deleted or currently in use. `deleted_samples` stores the `audit_id`, and `team_name` of a sample that was deleted. To filter out all non-deleted samples we simply check if the `audit_id` of the sample we are currently checking is not in the `deleted_samples` table. Although this may seem like a hassle, this approach does allow us to easily fetch the `audit_id`s of every deleted sample as a bonus.

#### **The Schema**

Well, I do have to say that I am not too happy with the current state of the schema and database design but it works. But, I digress, and will explain thought process behind each part of the schema below.

I will not be copy pasting the contents of the prisma schema here. Please see [schema.prisma][schema-link]

##### **Teams**

Every piece of data in this project can be traced back to a team. They are the most fundamental piece of information, without any teams it is impossible to manage other pieces of data. Teams are extremely important for identifying and separating samples into their respective teams. They also allow for the "infinite growth" of this project. As new teams or departments express interest in a project like this, it becomes very easy to add them as a team and everything else will be taken care of.

##### **Fields**

Fields are closely realated to teams as they define what specific information that a team wants to store about a sample. They also work closely with samples as a teams fields define what keys you can expect to live in a samples (from that team) `data` field. This means that teams can add and remove fields as they please and samples can reflect those changes. It is important to note that since fields can come and go as they please, older and newer samples may be missing or have extra fields. This is not a problem as we only display the fields that are currently present in the `fields` table but it is important to know.

##### **Samples**

Samples are the main piece of data we store. Scientists are constantly creating, deleting, and editing samples. And the way we store them is pretty simple. Every sample has these 8 properties: `id`, `audit_id`, `audit_number`, `date_created`, `date_modified`, `expiration_date`, `team_name`, and `data`. Each sample is defined in a very generic manner, but the flexibility comes with the `data` field. The `data` field is stored as a JSON object and has keys that are mostly equivalent to those defined in the `fields` table. The reason I say mostly equivalent is because, as the `fields` are updated, older samples are not updated to include those fields. The current way to deal with that is display missing `fields` in a sample as `N/A`.

##### **Printers**

The printers table is very simple, we just store an `ip`, `name`, and `location` of each printer. It's important to keep track of each printers IP as it is what we use to send over the raster data via `IPP`.

##### **Labels**

### **API**

Please see [API.md][api-def-link]

### **Rasterizing Images**

This is definetely the most complex and annoying, but integral, part of this project.

### **Environment Variables**

There are a couple environment variables that should be set by you so that things are working properly. These should be in a `.env` which is direct child of the `server` folder.

### **Database**

#### **DB_URI**

The `DB_URI` is the connection string to the database of your choice. The choice of database is up to you as long as `Prisma` can support it. By default we have set `Prisma` to use `postgresql`.

`.env`

> DB_URI=postgreqsql://user:password@host:port/database-name

### **Emailing**

To get the automatic emailing setup you will need to set three environment variables.

-   EMAIL_USER
-   EMAIL_PASSWORD
-   DEFAULT_EMAIL_TARGET

#### **`EMAIL_USER`**

This is the email address of the account that will send the emails.

`.env`

> EMAIL_USER=my_email@gmail.com

#### **`EMAIL_PASSWORD`**

This is the app password for the email account specified for `EMAIL_USER`. This is not the password to your email account.

For gmail users you can generate an app password by going to `https://myaccount.google.com/` in a browser where you are logged into your gmail account. Then, once you have 2-Factor authentication setup, you can generate an app password and set the environment variable.

`.env`

> EMAIL_PASSWORD=aj18xlaieo10

#### **`DEFAULT_EMAIL_TARGET`**

By default, we attempt to resolve the targets email by looking for the `isid` key in a samples `data` field. If none is found, we fallback to this environment variables value. It is probably more feasible to add `isid` as a required key in the `sample` schema.

The code that actually implements this is as follows

```typescript
let emailTarget = process.env.DEFAULT_EMAIL_TARGET
if (sample.data && sample.data.hasOwnProperty('isid')) {
    emailTarget = `${sample.data['isid']}@merck.com`
}
```

`.env`

> DEFAULT_EMAIL_TARGET=ardscientists@merck.com

## Points of Improvement

[schema-link]: /server/prisma/schema.prisma 'schema.prisma'
[api-def-link]: /server/API.md 'API.md'
