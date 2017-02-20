---
layout: post
title: Ado.net Bulk Delete 
description: bulk delete for ado.net , when deleting large data set 
meta: bulk delete for ado.net , when deleting large data set to avoid Sql timeouts
categories: [ado.net]
published: true
---

<hr class="bg-info">

Deleting a row or lots of rows from a SQL table ? how simple it is , write a one liner in LINQ or just few lines for ADO.net , job done ! . Most of the times when you have lots of tables linked we just have `CASCADE DELETE` and we go and simply write delete on the table , assuming other foreign keyed table records will be deleted very quickly. But when there are more than more foreign keyed tables with `CASCADE DELETE` and each have more than few **million** records , its going to very slow and result in the well know SQL Exception

 *"System.Data.SqlClient.SqlException (0x80131904): Timeout expired.  The timeout period elapsed prior to completion of the operation or the server is not responding."*

While you can see from the  **query execution plan** , there are lots of **Index seeks or scans** been performed by sql  *(to avoid index scans better to have non-clustered indexes)*  to check what else needs to be deleted  , resulting in Timeout. So some sort for logic needs to applied to overcome this huge data.

I came with quick and dirty solution to tackle this issue . Best way way to start with the lowest table with **millions** records and so on.  Most people might think of writing a stored procedure and add SQL some thing like below. 

```
WHILE (@@ROWCOUNT > 0)
BEGIN
    DELETE TOP (5000) FROM myTable
    WHERE <condition> = @condition
END
```

This can be achieved using simple C# code , it will take a while to execute but job will be done without timeout. The bulk insert method takes parameter of any type and its value , easy when you have more than one clause to check .

### Usage 

```
BulkDeleteParameters<dynamic> parameters = new BulkDeleteParameters<dynamic>()
{
  new Params<dynamic>() { ColumnName="ColumnName_1" , Value = Guid.Parse("Some Guid") } ,
  new Params<dynamic>() { ColumnName="ColumnName_2" , Value = int.Parse("Some int") } ,
};
```

```
    int rowsDeleted = SqlBulkDelete.ExecuteBatchDelete(parameters, "connectionString", "TableName");
```

### Implementation 

```     
 public static int ExecuteBatchDelete<dynamic>(BulkDeleteParameters<dynamic> parameters, 
                                                            string connectionString,
                                                            string tableName,
                                                            int batchSize = 10000)
    {
                int totalRowsAffected = 0;

                using (SqlConnection myConn = new SqlConnection(connectionString))
                {
                
                    myConn.Open();

                    for (int i = 0; i <= _maxRetries; i++)
                    {
                        
                            int rowCount = 0;

                            string deleteSql = string.Format(@"DELETE TOP ({0}) FROM {1}  WHERE 1 = 1", batchSize, tableName);

                                    foreach (Params<dynamic> tuple in parameters)
                                    {
                                        deleteSql += String.Format(" AND [{0}] = @{0}", tuple.ColumnName);
                                    }

                                    do
                                    {
                                        using (SqlCommand cmd = new SqlCommand(deleteSql, myConn))
                                        {

                                            cmd.CommandTimeout = 10000;

                                            foreach (Params<dynamic> tuple in parameters)
                                            {
                                                cmd.Parameters.AddWithValue(tuple.ColumnName, tuple.Value);
                                            }

                                            rowCount = cmd.ExecuteNonQuery();

                                            totalRowsAffected += rowCount;

                                            Debug.Print(string.Format("TOTALROWSAFFECTED: {0}", totalRowsAffected));

                                        }

                                    }
                                    while (rowCount != 0);

                                    break;

                             
                           
                    }
                }
                return totalRowsAffected;

    }
```
