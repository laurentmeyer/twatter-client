To restore database after csv upload:

```
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"messages"', 'id')), (SELECT MAX(id) FROM messages) + 1, FALSE);
\q
```

See [discussion](https://github.com/strapi/strapi/issues/12493)
