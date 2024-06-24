# Sistema Backend apresentado como projeto da disciplina Backend com Node e SQL

# PROPOSTA
Uma organização está desenvolvendo uma plataforma de cursos para fomentar a entrada no mercado de trabalho para diversas áreas. A plataforma de cursos deve permitir:

    - Cadastro de alunos;
    - Login de alunos cadastrados;
    - Ver cursos disponíveis;
    - Um aluno cadastrado pode:
        - Realizar inscrição em curso;
        - Cancelar inscrição em curso inscrito;
        - Ver cursos que ele está inscrito.

Dos requisitos não funcionais, estão:

    - A solução deve ser desenvolvida em JavaScript + Node.js;
    - O banco de dados deve ser relacional e é da sua responsabilidade a configuração dele;
    - O Front-end deve enviar as informações formatadas em JSON e deve receber também no formato JSON as respostas esperadas;
    - O projeto deve ter um package.json com script para start, para iniciar a aplicação.

# Descrição das funcionalidades

| Funcionalidade                           	| Objetivo                                                                        	| Observações                                                                                                                                                            	|   	|   	|
|------------------------------------------	|---------------------------------------------------------------------------------	|------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|---	|---	|
| Cadastro do aluno                        	| Permitir qualquer pessoa que tenha interesse em participar faça seu cadastro    	| Precisam ser solicitados pelo menos o nome, email e idade do aluno. O mesmo email não pode ser usado por dois alunos;                                                  	|   	|   	|
| Realizar login                           	| Permitir ao usuário realizar o login com seu usuário e senha                    	|                                                                                                                                                                        	|   	|   	|
| Listar cursos disponíveis para inscrição 	| Permitir que qualquer pessoa que acesse a plataforma veja os cursos disponíveis 	| A ação de inscrição só pode estar visível para usuários logados; Apresentar somente cursos que ainda não foram iniciados; Apresentar informação com inscritos no curso 	|   	|   	|
| Realizar inscrição                       	| Permitir o usuário logado realizar inscrição em um curso                        	| Um aluno só pode estar inscrito uma vez em cada curso                                                                                                                  	|   	|   	|
| Cancelar inscrição                       	| Permitir o usuário logado cancelar a inscrição em um curso inscrito             	| A registro de inscrição não deve ser removido, deve ser armazenada data e hora do cancelamento (impedindo uma nova inscrição no curso)                                 	|   	|   	|
| Listar cursos inscritos                  	| Permitir o usuário logado listar os cursos que ele está inscrito                	| Incluir cursos que ele cancelou a inscrição                                                                                                                            	|   	|   	|

# Comunicação esperada pelo front end

| Ação                    	| Rota             	| Envio                                                                                                      	| Retorno esperado                                                                                                                                                                                                                                                                                                                                                                         	|
|-------------------------	|------------------	|------------------------------------------------------------------------------------------------------------	|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Criar conta             	| /usuarios        	| { “nome”: “nome do aluno”, “email”:”email do aluno”, “senha”:”senha do aluno”, “nascimento”:”dd/mm/aaaa” } 	| Se der certo, status code 200: qualquer resposta Se der errado, status code 400: { “mensagem”: “motivo da falha” }                                                                                                                                                                                                                                                                       	|
| Login                   	| /login           	| { “email”:”email do aluno”, “senha”:”senha do aluno” }                                                     	| Se der certo, status code 200 + JWT configurado nos cookies Se der errado, status code 400: { “mensagem”: “motivo da falha” }                                                                                                                                                                                                                                                            	|
| Listar cursos           	| /cursos          	| (opcional) { “filtro”: “string de busca” }                                                                 	| Sempre retornar status code 200 com um array de cursos (vazio no caso de não ter resultados): [{ “id”: “id do curso”, “nome”:”nome do curso”, “descrição”: “descrição do curso”, “capa”:”url da imagem de capa”, “inscricoes”: 0, “inicio”: “dd/mm/aaaa”, “inscrito”: false }]                                                                                                           	|
| Fazer inscrição         	| /cursos/:idCurso 	| (usar JWT para identificar o usuário)                                                                      	| Retornar status code 403 se não tiver logado Retornar status code 404 se não existir o curso Retornar status code 200 se a inscrição for bem sucedida Retornar status code 400 se der errado com: { “mensagem”: “motivo da falha” }                                                                                                                                                      	|
| Cancelar inscrição      	| /cursos/:idCurso 	| (usar JWT para identificar o usuário)                                                                      	| Retornar status code 403 se não tiver logado Retornar status code 404 se não existir Retornar status code 200 se o cancelamento for bem sucedido Retornar status code 400 se der errado com: { “mensagem”: “motivo da falha” }                                                                                                                                                           	|
| Listar cursos inscritos 	| /:idUsuario      	| (usar JWT para identificar o usuário)                                                                      	| Retornar status code 403 caso o id da rota não for o mesmo do usuário logado Sempre retornar status code 200 com um array de cursos (vazio no caso de não ter resultados): [{ “id”: “id do curso”, “nome”:”nome do curso”, “descrição”: “descrição do curso”, “capa”:”url da imagem de capa”, “inscricoes”: 0, “inicio”: “dd/mm/aaaa”, “inscricao_cancelada”: false, “inscrito”: true }] 	|


