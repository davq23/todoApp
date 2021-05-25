<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddUser extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'u_id' => [
                'type'              => 'BIGINT',
                'constraint'        => 20,
                'unsigned'          => true,
                'auto_increment'    => true,
            ],
            
            'u_name' => [
                'type'              => 'VARCHAR',
                'constraint'        => 12,
            ],

            'u_password' => [
                'type'              => 'TEXT',
            ],

            'u_created_at datetime default current_timestamp',
            'u_updated_at datetime default current_timestamp on update current_timestamp',
        ]);

        $this->forge->addPrimaryKey('u_id');
        $this->forge->addUniqueKey('u_name');

        $this->forge->createTable('e_user');
    }

    public function down()
    {
        $this->forge->dropTable('e_user');
    }
}